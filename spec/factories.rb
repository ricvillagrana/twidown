require 'faker'

FactoryBot.define do

  factory :user do
    name { Faker::Name.name }
    username { Faker::Internet.username }
    email { Faker::Internet.email }
    password { Faker::Internet.password }
  end

  factory :post do
    content { Faker::Lorem.paragraph }
  end

end
