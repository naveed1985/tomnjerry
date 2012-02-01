class Game < ActiveRecord::Base
  validates :name, {:presence=>true, :uniqueness=>{ :scope => :user_id} }
  validates :user_id, {:presence=>true}
  serialize :board
end