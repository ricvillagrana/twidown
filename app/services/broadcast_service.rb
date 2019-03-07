module BroadcastService
  class << self
    def broadcast(params)
      action = params[:action]
      post = params[:post]
      user = params[:user]

      broadcast_message(user.id, action, post)
      user.followers.each do |follower|
        broadcast_message(follower.id, action, post)
      end
    end

    def broadcast_message(id, action, post)
      PostChannel.broadcast_to(
        id,
        message: { post: post.to_json(include: [:user]), action: action }
      )
    end   
  end
end
