LfmNetwork::Application.routes.draw do
  get "fetcher/index"
  post "fetcher/get_user"

  root :to => 'fetcher#index'
end
