class SessionsController < ApplicationController

  def create

    unless params[:username].blank? and params[:password].blank?
      user = User.authenticate(params[:username], params[:password])
      if user
        self.current_user = user
        response =  self.current_user
        session[:current_user] = user
      else
        response = { :error =>"Username or password is not correct!"}
      end
    else
      response = { :error =>"Username or password is not correct!"}
    end
    respond_to do |format|
      format.js {render :json=> response.to_json}
      format.html {render :json=> response.to_json}
    end
  end

  def destroy
    session[:current_user] = nil
    respond_to do |format|
      format.js {render :text=>"loggedout"}
      format.html {render :text=>"loggedout"}
    end
  end

end