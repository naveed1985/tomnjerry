class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :find_current_user
  attr_accessor :current_user

  protected
  def find_current_user
    unless session[:current_user].nil?
      self.current_user = session[:current_user]
    else
      self.current_user = nil
    end
  end
end
