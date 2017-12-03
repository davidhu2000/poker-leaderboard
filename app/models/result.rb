# == Schema Information
#
# Table name: results
#
#  id         :integer          not null, primary key
#  place      :integer
#  amount_won :string
#  player_id  :integer
#  game_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Result < ApplicationRecord
  validates :place, numericality: true
  validates :amount_won, numericality: true
  validates :player_id, presence: true
  validates :game_id, presence: true

  belongs_to :player
  belongs_to :game
end
