module Broadcast
  module ProfilePost
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
        broadcast_message(post.user_id, action, post)
      end

      def broadcast_message(id, action, post)
        ProfilePostChannel.broadcast_to(
          id,
          message: {
            post: post.to_json(
              include: [
                :user,
                users: {
                  only: [:name, :username]
                }
              ],
              methods: [:likes_count, :like_ids, :comments_count]
            ),
            action: action
          }
        )
      end
    end
  end
end
