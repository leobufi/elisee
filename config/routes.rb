Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  resources :songs, except: [:edit, :update] do
    resources :likes, only: [:new, :create, :destroy]
  end
  get '/songs_autocomplete', to: 'songs#autocomplete'
  get '/song', to: 'songs#show'
  get '/dashboard', to: 'pages#dashboard'
end

# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
