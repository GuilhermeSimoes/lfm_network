LfmNetwork::Application.routes.draw do
  post "fetch/user"
  get "fetch/user" => 'fetch#index'
  get "fetch/index"

  root :to => 'fetch#index'
end
