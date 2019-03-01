class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  #validates :password, confirmation: true
  validates :username, presence: true, length: { minimum: 3 }, uniqueness: true
  validates :name, presence: true, length: { minimum: 3 }

  serialize :options
end
