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
end
