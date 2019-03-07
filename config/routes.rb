Rails.application.routes.draw do
  root 'pages#index'
  devise_for :users, controllers: { sessions: 'users/sessions' }

  post '/users/register', to: 'sessions#create'
  post '/users/login', to: 'sessions#login'

  get '/users/me', to: 'sessions#show'

  resources :users, only: [:index]
  resources :posts
  
  get '/users/:username', to: 'users#show'
  post '/users/follow', to: 'users#follow'
  delete '/users/unfollow/:id', to: 'users#unfollow'

  get '/people', to: 'pages#people'
end
