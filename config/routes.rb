Rails.application.routes.draw do
  root 'pages#index'
  devise_for :users, controllers: { sessions: 'users/sessions' }

  post '/users/register', to: 'sessions#create'
  post '/users/login', to: 'sessions#login'

  get '/users/me', to: 'sessions#show'

  resources :posts
  
  get '/users/:username', to: 'users#show'
end
