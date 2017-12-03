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

require 'test_helper'

class ResultTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
