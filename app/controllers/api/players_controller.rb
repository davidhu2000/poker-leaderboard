class Api::PlayersController < ApplicationController
  def index
    @players = Player.all
  end

  def create 
    Player.create(player_params) 
  end

  def winnings
    if params[:season]
      @games = Game.where("extract(year from games.date) = ?", params[:season])
    else
      @games = Game.all
    end

    @min_games_filter = params[:min_games_filter].to_i

    @players = Player.all
    @results = Result.where(game_id: @games).includes(:game)
    @buyins = Buyin.where(game_id: @games).includes(:game)
  end

  private 

  def player_params 
    params.require(:player).permit(:name)
  end
end
