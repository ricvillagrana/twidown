module PostService
  class << self
    def destroy(post)
      unattach_comments(post)
      #unattach_reposts(post)
      post.destroy
    end

    def unattach_comments(post)
      post.comments.map do |comment|
        comment.update!(post_id: nil)
        Broadcast::Post.updated(comment)
      end
    end

    def unattach_reposts(post)
      post.reposts.map do |repost|
        repost.update!(repost_id: nil)
        Broadcast::Post.updated(repost)
      end
    end
  end
end
