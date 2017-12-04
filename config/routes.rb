Rails.application.routes.draw do
  root 'root#index'

  namespace :api, defaults: { format: :json } do
    resources :players, only: [:index, :create]
    resources :games, only: [:index, :create]
  end
end
