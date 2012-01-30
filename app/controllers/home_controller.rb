class HomeController < ApplicationController

  layout "application"

  def index
    render :file=>"public/main.html",:layout=>false
  end

end