Rails.application.routes.draw do
  root 'pages#index'
  devise_for :users, controllers: { sessions: 'users/sessions' }
end
