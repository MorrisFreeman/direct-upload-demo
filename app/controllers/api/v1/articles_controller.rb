# frozen_string_literal: true

module Api
  module V1
    # ArticlesController
    class ArticlesController < ApplicationController
      skip_before_action :verify_authenticity_token

      def index
        articles = Article.all
        articles = articles.map do |article|
          {
            id: article.id,
            url: article.article_url,
            mime_type: article.article.mime_type,
          }
        end
        render json: articles
      end

      def create
        article = Article.new(article_params)
        if article.save
          render json: { message: "Success" }, status: :ok
        else
          render json: { error: article.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end

      def create_with_direct_upload
        article_data = params[:article][:article_data]
        article = Article.new(article_data:)
        if article.valid?
          # article.article_attacher.create_derivatives # ファイルの圧縮などの処理を行う
          article.article_attacher.promote
          article.save
          render json: { message: "Success" }, status: :ok
        else
          render json: { error: article.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end

      private

      def article_params
        params.require(:article).permit(:article)
      end
    end
  end
end
