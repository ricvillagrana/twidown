class Post < ApplicationRecord
  before_destroy :destroy_likes
  after_create do
    broadcast_to_followers(:created)
  end

  before_destroy do
    broadcast_to_followers(:destroyed)
  end

  after_update do
    broadcast_to_followers(:updated)
  end

  belongs_to :user
  belongs_to :post, optional: true

  has_many :likes

  has_many :users, through: :likes, class_name: 'User'

  default_scope { order('created_at desc') }

  validates :content, length: { minimum: 1 }

  def destroy_likes
    likes.destroy_all
  end

  private

  def broadcast_to_followers(action)
    broadcast_message(user.id, action)
    user.followers.each do |follower|
      broadcast_message(follower.id, action)
    end
  end

  def broadcast_message(id, action)
    PostChannel.broadcast_to(
      id,
      message: { post: self.to_json(include: [:user]), action: action}
    )
  end
end
