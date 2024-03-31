class Article < ApplicationRecord
  include ArticleUploader::Attachment(:article)
end
