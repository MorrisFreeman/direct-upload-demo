
class ArticleUploader < Shrine
  # plugin :derivatives # 画像の変換を管理
  # Attacher.derivatives do |original|

  #   magick = ImageProcessing::MiniMagick.source(original)

  #   # 画像処理を定義
  #   {
  #     large:  magick.resize_to_limit!(800, 800),
  #     medium: magick.resize_to_limit!(500, 500),
  #     small:  magick.resize_to_limit!(300, 300),
  #   }
  # end
end
