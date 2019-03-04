class Post < ApplicationRecord
  before_destroy :destroy_likes

  after_create :broadcast_to_followers

  belongs_to :user
  belongs_to :post, optional: true

  has_many :likes

  has_many :users, through: :likes, class_name: 'User'

  default_scope { order('created_at desc') }

  def destroy_likes
    likes.destroy_all
  end

  private

  def broadcast_to_followers 
    broadcast_message(user.id)
    user.followers.each do |follower|
      broadcast_message(follower.id)
    end
  end

  def broadcast_message(id)
    PostChannel.broadcast_to(
      id,
      message: self.to_json(include: [:user])
    )
  end
end
