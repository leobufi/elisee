Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :songs, except: [:edit, :update] do
    resources :likes
  end
  get "/songs_autocomplete", to: 'songs#autocomplete'
  post "/get_song_from_search", to: 'songs#show'
end
