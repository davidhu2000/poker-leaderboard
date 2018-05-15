Rails.application.routes.draw do
  root 'root#index'

  namespace :api, defaults: { format: :json } do
    resources :players, only: [:index, :create]
    resources :games, only: [:index, :create]
    get 'players/winnings', to: 'players#winnings'

    get 'analytics/winnings_by_date', to: "analytics#winnings_by_date"
    get 'analytics/win_loss_against', to: "analytics#win_loss_against"
  end
end
