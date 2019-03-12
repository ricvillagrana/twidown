module Broadcast
  module Post
    class << self
      def created(post)
        broadcast(post, :created)
      end

      def updated(post)
        broadcast(post, :updated)
      end

      def destroyed(post)
        broadcast(post, :destroyed)
      end

      def broadcast(post, action)
        broadcast_message(post.user.id, action, post)
        post.user.followers.each do |follower|
          broadcast_message(follower.id, action, post)
        end
      end

      def broadcast_message(id, action, post)
        params = [
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
        ]
        PostChannel.broadcast_to(*params)
        ProfilePostChannel.broadcast_to(*params)
      end
    end
  end
end
