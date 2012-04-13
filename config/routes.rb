LfmNetwork::Application.routes.draw do
  get "fetcher/index"
  post "fetcher/get_artist"

  root :to => 'fetcher#index'
end
