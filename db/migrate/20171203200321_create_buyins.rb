class CreateBuyins < ActiveRecord::Migration[5.0]
  def change
    create_table :buyins do |t|
      t.integer :number_times_bought_in, default: 1, null: false
      t.integer :game_id, null: false
      t.integer :player_id, null: false

      t.timestamps
    end
  end
end
