LfmNetwork::Application.routes.draw do
  post "fetch_user" => 'fetch#user', :as => 'fetch_user'
  get "/fetch" => 'fetch#user'
  
  root :to => 'fetch#index'
  
  match '*uri' => redirect('/')
end
