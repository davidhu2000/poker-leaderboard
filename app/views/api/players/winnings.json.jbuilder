json.array! @players do |player|
  next if player.games_played < 5
  json.name player.name
  json.totalWinnings player.total_winnings
  json.netWinnings player.net_winnings
  json.gamesPlayed player.games_played
  json.numberFirst player.number_of_places(1)
  json.numberSecond player.number_of_places(2)
  json.numberThird player.number_of_places(3)
end