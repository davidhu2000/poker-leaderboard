class RenameBuyinColumnInGames < ActiveRecord::Migration[5.0]
  def change
    rename_column :games, :buyin, :buyin_amount
  end
end
