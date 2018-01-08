json.array! @players do |player|
  games_played = @buyins.where(player_id: player).map(&:game_id).uniq.count
  next if games_played < 3
  
  total_winnings = @results.where(player_id: player).map(&:amount_won).reduce(&:+) || 0
  
  number_buyins = 0 
  total_buyins = 0
  @buyins.where(player_id: player).each do |buyin|
    number_buyins += buyin.number_times_bought_in
    total_buyins += buyin.number_times_bought_in * buyin.game.buyin_amount
  end
  
  player_places = @results.where(player_id: player).map(&:place)
  number_first = player_places.count(1)
  number_second = player_places.count(2)
  number_third = player_places.count(3)
  
  net_winnings = total_winnings - total_buyins
  
  json.name player.name
  json.totalWinnings total_winnings
  json.numberBuyins number_buyins
  json.totalBuyins total_buyins
  json.netWinnings net_winnings
  json.gamesPlayed games_played
  json.numberFirst number_first
  json.numberSecond number_second
  json.numberThird number_third
end