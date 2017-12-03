# == Schema Information
#
# Table name: buyins
#
#  id                     :integer          not null, primary key
#  number_times_bought_in :integer          default(1), not null
#  game_id                :integer          not null
#  player_id              :integer          not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class Buyin < ApplicationRecord
  belongs_to :player
  belongs_to :game

  validates :number_times_bought_in, numericality: true
end
