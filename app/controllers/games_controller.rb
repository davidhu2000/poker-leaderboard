class GamesController < ApplicationController
  def create
    
  end

  private 

  def games_params
    params.require(:game).permit(:buyin_amount, :date, buyins: [], results: [])
  end
end
