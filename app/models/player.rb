# == Schema Information
#
# Table name: players
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Player < ApplicationRecord
  validates :name, presence: true

  has_many :results
  has_many :buyins
  has_many :games, through: :buyins

  def total_winnings
    self.results.map(&:amount_won).reduce(&:+) || 0
  end
  
  def total_buyins
    total = 0
    self.buyins.each do |buyin|
      total += buyin.number_times_bought_in * buyin.game.buyin_amount
    end
    total
  end

  def net_winnings
    total_winnings - total_buyins
  end

  def games_played
    self.games.count
  end

  def number_of_places(place)
    self.results.map(&:place).count(place)
  end
end
