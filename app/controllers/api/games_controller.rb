class Api::GamesController < ApplicationController
  def create
    ActiveRecord::Base.transaction do
      _params = params[:game]
      
      @game = Game.create(
        date: _params[:date],
        buyin_amount: _params[:buyin]
      )

      _params[:players].each do |player_id, times_bought_in|
        Buyin.create(
          number_times_bought_in: times_bought_in,
          player_id: player_id,
          game_id: @game.id
        )
      end

      Result.create(
        place: 1,
        amount_won: _params[:firstPlaceAmount],
        player_id: _params[:firstPlaceId],
        game_id: @game.id
      )

      Result.create(
        place: 2,
        amount_won: _params[:secondPlaceAmount],
        player_id: _params[:secondPlaceId],
        game_id: @game.id
      )
      if _params[:thirdPlaceId]
        Result.create(
          place: 3,
          amount_won: _params[:thirdPlaceAmount],
          player_id: _params[:thirdPlaceId],
          game_id: @game.id
        )
      end
    end
  end
  
  private
  
  def games_params
    params.require(:game).permit(
      :buyin, :date, :firstPlaceId, :secondPlaceId, :thirdPlaceId, 
      :firstPlaceAmount, :secondPlaceAmount, :thirdPlaceAmount, players: {}
    )
  end
end
