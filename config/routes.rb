Rails.application.routes.draw do
  resources :microposts, only: [:new, :create, :index, :show]
end
