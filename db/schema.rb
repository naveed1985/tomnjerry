# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120130091437) do

  create_table "games", :force => true do |t|
    t.integer  "user_id"
    t.integer  "tom_score"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.integer  "lifeTom"
    t.integer  "lifeFelix"
    t.integer  "scoreTom"
    t.integer  "scoreFelix"
    t.text     "board"
    t.integer  "FelixX"
    t.integer  "FelixY"
    t.integer  "TomX"
    t.integer  "TomY"
    t.integer  "MouseX"
    t.integer  "MouseY"
    t.integer  "TomBombX"
    t.integer  "TomBombY"
    t.integer  "TomArrowX"
    t.integer  "TomArrowY"
    t.integer  "FelixBombX"
    t.integer  "FelixBombY"
    t.integer  "FelixArrowX"
    t.integer  "FelixArrowY"
    t.integer  "TomAddon"
    t.integer  "FelixAddon"
    t.integer  "Tom_bomb_activate"
    t.integer  "Felix_bomb_activate"
    t.integer  "Tom_bomb_explode"
    t.integer  "Felix_bomb_explode"
    t.integer  "Tom_arrow_activate"
    t.integer  "Felix_arrow_activate"
    t.integer  "TomBdir"
    t.integer  "FelixBdir"
    t.integer  "TbombMove"
    t.integer  "TarrowMove"
    t.integer  "FbombMove"
    t.integer  "FarrowMove"
    t.integer  "TmoveCount"
    t.integer  "TAMCount"
    t.integer  "FmoveCount"
    t.integer  "FAMCount"
    t.integer  "TomBcount"
    t.integer  "TomAcount"
    t.integer  "FelixBcount"
    t.integer  "FelixAcount"
    t.integer  "TomBcheck"
    t.integer  "TomAcheck"
    t.integer  "FelixBcheck"
    t.integer  "FelixAcheck"
    t.integer  "checklife"
    t.integer  "tossWinner"
  end

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "encrypted_password"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
