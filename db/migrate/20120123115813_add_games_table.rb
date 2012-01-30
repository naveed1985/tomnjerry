class AddGamesTable < ActiveRecord::Migration
  def self.up
    create_table :games do |t|
      t.integer :user_id
      t.integer :tom_x
      t.integer :felix_x
      t.integer :tom_y
      t.integer :felix_y
      t.integer :tom_score
      t.integer :fexlix_score
      t.integer :tom_lives
      t.integer :felix_lives
      t.integer :tom_bombs
      t.integer :felix_bombs
      t.timestamps
    end
  end

  def self.down
    drop_table :games
  end
end
