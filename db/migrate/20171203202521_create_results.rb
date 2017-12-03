class CreateResults < ActiveRecord::Migration[5.0]
  def change
    create_table :results do |t|
      t.integer :place
      t.string :amount_won
      t.integer :player_id
      t.integer :game_id
      t.timestamps
    end
  end
end
