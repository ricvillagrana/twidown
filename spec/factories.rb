require 'faker'

FactoryBot.define do

  factory :user do
    name { Faker::Person.name }
    username { Faker::Internet.username }
    email { Faker::Internet.email }
    password { Faker::Internet.password }
  end

  factory :post do
    name { Faker::Lorem.paragraph }
  end

end
