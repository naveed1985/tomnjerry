class GamesController < ApplicationController

  def index
    @games = Game.find_all_by_user_id(current_user.id)
    respond_to do |format|
      format.js  {render :layout=>false}
      format.html{render :layout=>false}
    end
  end

  def new
    render :file=>"public/game.html",:layout=>false
  end

  def show
    @game = Game.find(params[:id])
    render :file=>"public/game.html.erb",:layout=>false
  end

  def create
    game = Game.create({
      :name                 => params[:game_name],
      :user_id              => current_user.id,
      :lifeTom              => params[:lifeTom],
      :lifeFelix            => params[:lifeFelix],
      :scoreTom             => params[:scoreTom],
      :scoreFelix           => params[:scoreFelix],
      :board                => params[:board],
      :FelixX               => params[:FelixX],
      :FelixY               => params[:FelixY],
      :TomX                 => params[:TomX],
      :TomY                 => params[:TomY],
      :MouseX               => params[:MouseX],
      :MouseY               => params[:MouseY],
      :TomBombX             => params[:TomBombX],
      :TomBombY             => params[:TomBombY],
      :TomArrowX            => params[:TomArrowX],
      :TomArrowY            => params[:TomArrowY],
      :FelixBombX           => params[:FelixBombX],
      :FelixBombY           => params[:FelixBombY],
      :FelixArrowX          => params[:FelixArrowX],
      :FelixArrowY          => params[:FelixArrowY],
      :TomAddon             => params[:TomAddon],
      :FelixAddon           => params[:FelixAddon],
      :Tom_bomb_activate    => params[:Tom_bomb_activate],
      :Felix_bomb_activate  => params[:Felix_bomb_activate],
      :Tom_bomb_explode     => params[:Tom_bomb_explode],
      :Felix_bomb_explode   => params[:Felix_bomb_explode],
      :Tom_arrow_activate   => params[:Tom_arrow_activate],
      :Felix_arrow_activate => params[:Felix_arrow_activate],
      :TomBdir              => params[:TomBdir],
      :FelixBdir            => params[:FelixBdir],
      :TbombMove            => params[:TbombMove],
      :TarrowMove           => params[:TarrowMove],
      :FbombMove            => params[:FbombMove],
      :FarrowMove           => params[:FarrowMove],
      :TmoveCount           => params[:TmoveCount],
      :TAMCount             => params[:TAMCount],
      :FmoveCount           => params[:FmoveCount],
      :FAMCount             => params[:FAMCount],
      :TomBcount            => params[:TomBcount],
      :TomAcount            => params[:TomAcount],
      :FelixBcount          => params[:FelixBcount],
      :FelixAcount          => params[:FelixAcount],
      :TomBcheck            => params[:TomBcheck],
      :TomAcheck            => params[:TomAcheck],
      :FelixBcheck          => params[:FelixBcheck],
      :FelixAcheck          => params[:FelixAcheck],
      :checklife            => params[:checklife],
      :tossWinner           => params[:tossWinner]
      })
    
      if game.errors.blank?
          response =  game
      else
        response = { :error =>game.errors.full_messages.join("\n")}
      end

    respond_to do |format|
      format.js {render :json=> response.to_json}
      format.html {render :json=> response.to_json}
    end
  end
  
end