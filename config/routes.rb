LfmNetwork::Application.routes.draw do
  post "fetch/user"

  root :to => 'fetch#index'
  
  match '*uri' => redirect('/')
end
