# json.array! @players do |player|
# end

@players.each do |player|
  json.set! player.id do
    json.id player.id
    json.name player.name
  end
end