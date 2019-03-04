class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  #validates :password, confirmation: true
  validates :username, presence: true, length: { minimum: 3 }, uniqueness: true
  validates :name, presence: true, length: { minimum: 3 }

  serialize :options

  has_many :posts
  has_many :likes
  has_many :liked_posts, through: :likes, class_name: 'Post'
  has_many :following_follow, class_name: 'Follow', foreign_key: 'follower_id'
  has_many :followers_follow, class_name: 'Follow', foreign_key: 'following_id'

  has_many :following, through: :following_follow
  has_many :followers, through: :followers_follow

  def following_posts
    following.map(&:posts).flatten
  end

  def follower_posts
    followers.map(&:posts).flatten
  end
end
