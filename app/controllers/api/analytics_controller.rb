class Api::AnalyticsController < ApplicationController
  before_action :set_games

  def winnings_by_date
    @data = {}
    games_count = Hash.new { |h, k| h[k] = 0 }
    player_win_total = Hash.new { |h, k| h[k] = 0 }
    player_buyin_total = Hash.new { |h, k| h[k] = 0 }

    @dates = []

    @games.each do |game|
      @dates << game.date unless @dates.include? game.date

      game.results.each do |result|
        games_count[result.player.name] += 1
        player_win_total[result.player.name] += result.amount_won
        @data[result.player.name] ||= {}
        @data[result.player.name][game.date] ||= {}
        @data[result.player.name][game.date][:total] ||= 0

        @data[result.player.name][game.date][:total] = player_win_total[result.player.name]
      end

      game.buyins.each do |buyin|
        player_buyin_total[buyin.player.name] += buyin.number_times_bought_in * game.buyin_amount
        @data[buyin.player.name] ||= {}
        @data[buyin.player.name][game.date] ||= {}
        @data[buyin.player.name][game.date][:buyins] ||= 0
        @data[buyin.player.name][game.date][:buyins] = player_buyin_total[buyin.player.name]
      end
    end

    @data = @data.select { |player, data| data.count > 2 }
    
    # fill in empty dates with previous date's data
    @data.each do |player, date_hash|
      @dates.each_with_index do |date, index|
        date_hash[date] ||= {}
        
        if index.zero?
          date_hash[date][:buyins] ||= 0
          date_hash[date][:total] ||= 0
        else 
          date_hash[date][:buyins] ||= date_hash[@dates[index - 1]][:buyins]
          date_hash[date][:total] ||= date_hash[@dates[index - 1]][:total]
        end

        date_hash[date][:net] = date_hash[date][:total] - date_hash[date][:buyins]
      end
    end

    players = Hash.new { |h, k| h[k] = {} }

    @data.each do |player, date_hash|
      players[player][:net] ||= []
      players[player][:total] ||= []
      players[player][:buyins] ||= []

      date_hash.keys.sort.each do |key|
        players[player][:net] << date_hash[key][:net]
        players[player][:total] << date_hash[key][:total]
        players[player][:buyins] << date_hash[key][:buyins]
      end
    end


    render json: {
      players: players,
      dates: @dates
    }
  end

  def wins_percentage_against
    players = Hash.new do |h,k| 
      h[k] = Hash.new { |h2,k2| h2[k2] = { win: 0, loss: 0 } } 
    end


    results = Result.where(game_id: @games).includes(:game, :player)

    @games.each do |game|
      results = game.results
      first_place = results.where(place: 1, game_id: game).first
      second_place = results.where(place: 2, game_id: game).first
      third_place = results.where(place: 3, game_id: game).first

      results.each do |result|
        
        if first_place.player.name != result.player.name
          players[first_place.player.name][result.player.name] ||= { win: 0, loss: 0 }
          players[first_place.player.name][result.player.name][:win] += 1
        end
        
        if second_place && result.player.name != second_place.player.name
          players[second_place.player.name][result.player.name] ||= { win: 0, loss: 0 }

          if result.player.name == first_place.player.name
            players[second_place.player.name][result.player.name][:loss] += 1
          else
            players[second_place.player.name][result.player.name][:win] += 1
          end

        end

        if third_place && result.player.name != third_place.player.name
          players[third_place.player.name][result.player.name] ||= { win: 0, loss: 0 }
          if [first_place.player.name, second_place.player.name].include?(result.player.name)
            players[third_place.player.name][result.player.name][:loss] += 1
          else
            players[third_place.player.name][result.player.name][:win] += 1
          end
        end
      end

      game.players.each do |player|
        next if game.winners.include?(player)
        players[first_place.player.name][player.name]
        players[first_place.player.name][player.name][:win] += 1
        players[second_place.player.name][player.name][:win] += 1 if second_place
        players[third_place.player.name][player.name][:win] += 1 if third_place

        [first_place, second_place, third_place].each do |place|
          next unless place
          players[player.name][place.player.name] ||= { win: 0, loss: 0 }
          players[player.name][place.player.name][:loss] += 1
        end
      end
    end

    players.each do |player, records|
      players[player] = records.delete_if { |k, v| v[:win] + v[:loss] < 5 }
    end.delete_if { |k2, v2| v2 == {} }

    render json: {
      players: players
    }
  end

  private 

  def set_games
    if params[:season]
      @games = Game.where("extract(year from games.date) = ?", params[:season])
    else
      @games = Game.all
    end
    @games = @games.order(:date).includes(:buyins, results: :player)
  end
end
