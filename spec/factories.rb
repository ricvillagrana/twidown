require 'faker'

FactoryBot.define do

  factory :user do
    name { Faker::Name.name }
    username { Faker::Internet.username }
    email { Faker::Internet.email }
    password { '123123' }
    password_confirmation { '123123' }
  end

  factory :post do
      content { Faker::Lorem.paragraph }
  end

end
