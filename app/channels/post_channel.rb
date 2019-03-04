class PostChannel < ApplicationCable::Channel
  def subscribed
    stream_from "post:#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
