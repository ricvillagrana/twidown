module BroadcastService
  class << self
    def broadcast(params)
      action = params[:action]
      post = params[:post]

      broadcast_message(post.user.id, action, post)
      post.user.followers.each do |follower|
        broadcast_message(follower.id, action, post)
      end
    end

    def broadcast_message(id, action, post)
      PostChannel.broadcast_to(
        id,
        message: {
          post: post.to_json(
            include: [
              :user,
              users: {
                only: [:name, :username]
              }
            ],
            methods: [:likes_count, :like_ids]
          ),
          action: action
        }
      )
    end   
  end
end
