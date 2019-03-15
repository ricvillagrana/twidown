require 'rails_helper'

RSpec.describe User, type: :model do

  before :all do
    @user       = create :user
    @follower  = create :user

    @follower.follow!(@user)
  end

  context 'Model validations' do
    it { should validate_presence_of :username }
    it { should validate_presence_of :name }
    it { should validate_presence_of :password }
    it { should validate_confirmation_of :password }
    it { should validate_uniqueness_of(:email).ignoring_case_sensitivity }
    it { should validate_uniqueness_of :username }
    it { should validate_length_of :name }
    it { should validate_length_of :username }
  end

  context 'Model association access' do
    it { should have_many :following }
    it { should have_many :followers }
    it { should have_many :posts }
    it { should have_many :likes }
    it { should have_many :liked_posts }
  end

  context 'Model methods follow/unfollow' do
    it 'should be able to follow another user' do
      expect(@user.followers).to eq([@follower])
    end

    it 'should be be able to check its followings' do
      expect(@follower.following).to eq([@user])
    end
  end

end
