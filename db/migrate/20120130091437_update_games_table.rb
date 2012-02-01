class UpdateGamesTable < ActiveRecord::Migration
  def self.up
    change_table :games do |t|
      #t.string :name
      t.remove :tom_x
      t.remove :felix_x
      t.remove :tom_y
      t.remove :felix_y
      t.remove :fexlix_score
      t.remove :tom_lives
      t.remove :felix_lives
      t.remove :tom_bombs
      t.remove :felix_bombs
      t.integer :lifeTom
      t.integer :lifeFelix
      t.integer :scoreTom
      t.integer :scoreFelix
      t.text    :board
      t.integer :FelixX
      t.integer :FelixY
      t.integer :TomX
      t.integer :TomY
      t.integer :MouseX
      t.integer :MouseY
      t.integer :TomBombX
      t.integer :TomBombY
      t.integer :TomArrowX
      t.integer :TomArrowY
      t.integer :FelixBombX
      t.integer :FelixBombY
      t.integer :FelixArrowX
      t.integer :FelixArrowY
      t.integer :TomAddon
      t.integer :FelixAddon
      t.integer :Tom_bomb_activate
      t.integer :Felix_bomb_activate
      t.integer :Tom_bomb_explode
      t.integer :Felix_bomb_explode
      t.integer :Tom_arrow_activate
      t.integer :Felix_arrow_activate
      t.integer :TomBdir
      t.integer :FelixBdir
      t.integer :TbombMove
      t.integer :TarrowMove
      t.integer :FbombMove
      t.integer :FarrowMove
      t.integer :TmoveCount
      t.integer :TAMCount
      t.integer :FmoveCount
      t.integer :FAMCount
      t.integer :TomBcount
      t.integer :TomAcount
      t.integer :FelixBcount
      t.integer :FelixAcount
      t.integer :TomBcheck
      t.integer :TomAcheck
      t.integer :FelixBcheck
      t.integer :FelixAcheck
      t.integer :checklife
      t.integer :tossWinner
    end
  end

  def self.down
  end
end
