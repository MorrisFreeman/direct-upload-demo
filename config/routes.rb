Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :articles, only: [:index, :create]
      post "articles/create_with_direct_upload" => "articles#create_with_direct_upload"
      get "hello" => "hello#index"
    end
  end
  # get "/images/presign", to: "presigns#image"
  mount Shrine.presign_endpoint(:cache) => "/s3/params"
end
