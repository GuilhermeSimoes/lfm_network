LfmNetwork::Application.routes.draw do
  get "fetch/index"
  post "fetch/user"

  root :to => 'fetch#index'
end
