# == Schema Information
#
# Table name: games
#
#  id           :integer          not null, primary key
#  date         :date             not null
#  buyin_amount :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Game < ApplicationRecord
  validates :date, presence: true
  validates :buyin_amount, numericality: true

  has_many :buyins
  has_many :players, through: :buyins
  has_many :results
  has_many :winners, through: :results, source: :player

  def first_place
    find_result(1)
  end

  def second_place
    find_result(2)
  end

  def third_place
    find_result(3)
  end

  def order_players_by_place
    [self.first_place, self.second_place, self.third_place, self.players].uniq
  end

  private

  def find_result(place)
    results.find_by(place: place)
  end
end
