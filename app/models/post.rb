class Post < ApplicationRecord
  belongs_to :user
  belongs_to :post, null: true

  has_many :likes
end
