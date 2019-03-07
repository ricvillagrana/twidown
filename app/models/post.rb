class Post < ApplicationRecord
  before_destroy :destroy_likes
  belongs_to :user
  belongs_to :post, optional: true

  has_many :likes

  has_many :users, through: :likes, class_name: 'User'

  default_scope { order('created_at desc') }

  validates :content, length: { minimum: 1 }

  def destroy_likes
    likes.destroy_all
  end

end
