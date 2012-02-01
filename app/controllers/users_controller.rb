class UsersController < ApplicationController

  def new
    respond_to do |format|
      format.js{render :xml=>current_user.to_json}
    end
  end

  def create
    
      user = User.create({:username=>params[:username], :password=>params[:password]})
      if user.errors.blank?
#        self.current_user = user
#        response =  self.current_user
#        session[:current_user] = user
          response =  user
      else
        response = { :error =>user.errors.full_messages.join("\n")}
      end
    
    respond_to do |format|
      format.js {render :json=> response.to_json}
      format.html {render :json=> response.to_json}
    end
  end

end