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

require 'test_helper'

class BuyinTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
