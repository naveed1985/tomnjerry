class User < ActiveRecord::Base
  attr_accessor :password
  validates :username, :presence => true, :format=>{:with => /^[-\w\._@]+$/i, :allow_blank => true, :message => "should only contain letters, numbers, or .-_@"}, :uniqueness=>true
  validates :password, :presence => true, :length => { :minimum => 6 }

  before_save :encrypt_password

  def self.authenticate(username, password)
    user = User.find_by_username(username)
    if(user)
      if(Digest::SHA1.hexdigest(password) == user.encrypted_password)
        return user
      end
    end
    return false
  end

  protected
  def encrypt_password
    self.encrypted_password = Digest::SHA1.hexdigest(self.password)
  end
end