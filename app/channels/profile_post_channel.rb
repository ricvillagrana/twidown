class ProfilePostChannel < ApplicationCable::Channel
  def subscribed
    stream_from "profile_post:#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
