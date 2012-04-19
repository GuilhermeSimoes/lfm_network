LfmNetwork::Application.routes.draw do
  post "fetch/user"
  get "fetch/user"

  root :to => 'fetch#index'
end
