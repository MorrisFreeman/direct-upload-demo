require 'shrine'
require 'shrine/storage/s3'
require 'shrine/storage/file_system'
require 'image_processing/mini_magick'

s3_options = {
  bucket:            ENV.fetch('S3_BUCKET_NAME'),
  access_key_id:     ENV.fetch('AWS_ACCESS_KEY_ID'),
  secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY'),
  region:            ENV.fetch('AWS_REGION'),
}

Shrine.storages = {
  cache: Shrine::Storage::S3.new(prefix: 'cache', **s3_options),
  store: Shrine::Storage::S3.new(prefix: 'store', **s3_options),
}

Shrine.plugin :activerecord
Shrine.plugin :cached_attachment_data
Shrine.plugin :restore_cached_data
Shrine.plugin :derivatives
Shrine.plugin :presign_endpoint, presign_options: -> (request) {
  # 署名付きURLの有効期限や権限など、必要に応じてオプションを設定
  {
    content_length_range: 0..10 * 1024 * 1024,
    content_disposition: 'attachment',
  }
}
