Rails.application.routes.draw do
  get 'likes/destroy'
  devise_for :users
  root to: "pages#home"
  resources :songs, except: [:edit, :update] do
    post :like, to: 'songs#like'

    resources :likes, only: [:destroy]
  end

  get '/songs_autocomplete', to: 'songs#autocomplete'
  get '/song', to: 'songs#show'
  get '/dashboard', to: 'pages#dashboard'
  post '/attach_image_url', to: 'songs#attach_image_url', as: :attach_image_url
  get 'dashboard/download_png', as: :download
end

# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
