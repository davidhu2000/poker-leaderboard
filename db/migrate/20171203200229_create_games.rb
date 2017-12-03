class CreateGames < ActiveRecord::Migration[5.0]
  def change
    create_table :games do |t|
      t.date :date, null: false
      t.integer :buyin, null: false
      t.timestamps
    end
  end
end
