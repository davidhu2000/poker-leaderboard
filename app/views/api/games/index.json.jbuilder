json.array! @games do |game|
  json.date game.date
  json.buyin game.buyin_amount

  json.potSize game.buyins.inject(0) do |sum, buyin|
    sum += buyin.number_times_bought_in * game.buyin_amount
  end

  json.buyin game.buyin_amount

  winners = [nil, nil, nil]

  game.results.each do |result|
    winners[result.place - 1] = {
      name: result.player.name,
      amountWon: result.amount_won
    }
  end

  
  players = []
  winner_names = winners.map { |winner| winner && winner[:name] }

  game.buyins.each do |buyin|
    if winner_names.include? buyin.player.name
      winners.each_with_index do |winner, index|
        if winner && winner[:name] == buyin.player.name
          winner[:timesBoughtIn] = buyin.number_times_bought_in
        end
      end
    else 
      players << { 
        name: buyin.player.name,
        timesBoughtIn: buyin.number_times_bought_in
      }
    end
  end
  
  json.winners winners
  json.players players
end