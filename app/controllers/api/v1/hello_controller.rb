# app/controllers/api/files_controller.rb
module Api
  module V1
    class HelloController < ApplicationController
      skip_before_action :verify_authenticity_token

      def index
        render json: { message: "Hello, World!" }
      end
    end
  end
end
