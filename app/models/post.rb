class Post < ApplicationRecord
  belongs_to :user
  belongs_to :post, optional: true

  has_many :likes
end
