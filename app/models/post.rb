class Post < ApplicationRecord
  before_destroy :destroy_likes
  belongs_to :user
  belongs_to :post, optional: true
  belongs_to :original_post, class_name: 'Post', optional: true, foreign_key: 'repost_id'

  has_many :likes
  has_many :users, through: :likes, class_name: 'User'
  has_many :comments, class_name: 'Post', foreign_key: 'post_id'
  has_many :reposts, class_name: 'Post', foreign_key: 'repost_id'

  default_scope { order('created_at desc') }

  validates :content, length: { minimum: 1 }

  def destroy_likes
    likes.destroy_all
  end

  def repost_count
    reposts.size
  end

  def likes_count
    likes.size
  end

  def repost_ids
    reposts.pluck(:id)
  end

  def like_ids
    users.pluck(:id)
  end

  def liked_by(user)
    users.append(user)
  end

  def unliked_by(user)
    users.delete(user)
  end

end
