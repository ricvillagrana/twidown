class Post < ApplicationRecord
  belongs_to :user
  belongs_to :post, optional: true

  has_many :likes, dependent: :delete_all

  has_many :users, through: :likes, class_name: 'User'

  has_many :comments, class_name: 'Post', foreign_key: 'post_id'

  default_scope { order('created_at desc') }

  validates :content, length: { minimum: 1 }

  def likes_count
    likes.size
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
