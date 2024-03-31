class PresignsController < ApplicationController
  def image
    # ... we can perform authentication here ...

    set_rack_response FileUploader.presign_response(:cache, request.env)
  end

  private

  def set_rack_response((status, headers, body))
    self.status = status
    self.headers.merge!(headers)
    self.response_body = body
  end
end
