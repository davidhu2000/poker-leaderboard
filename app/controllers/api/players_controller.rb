class Api::PlayersController < ApplicationController
  def index
    @players = Player.all
  end

  def create 
    Player.create(player_params) 
  end

  private 

  def player_params 
    params.require(:player).permit(:name)
  end
end
