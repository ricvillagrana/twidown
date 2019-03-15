require 'rails_helper'

RSpec.describe Post, type: :model do

  before :all do
    @user = create :user
    @post = create(:post, user_id: @user.id)
  end

  context 'Model validations' do
    it { should validate_length_of :content }
  end

  context 'Model association access' do
    it { should have_many :users }
    it { should have_many :comments }
    it { should have_many :likes }
    it { should have_many :reposts }
    it { should belong_to :user }
    it { should belong_to :post }
    it { should belong_to :original_post }
  end

  context 'Model methods' do
    it 'should be able to count comments' do
      expect(@post.comments_count).to eq(0)
      @post.comments.append(create(:post, user_id: @user.id))
      expect(@post.comments_count).to eq(1)
    end

    it 'should be able to count reposts' do
      expect(@post.repost_count).to eq(0)
      @post.reposts.append(create(:post, user_id: @user.id))
      expect(@post.repost_count).to eq(1)
    end

    it 'should be able to count likes' do
      expect(@post.likes_count).to eq(0)
      @post.liked_by(@user)
      expect(@post.likes_count).to eq(1)
      @post.unliked_by(@user)
      expect(@post.likes_count).to eq(0)
    end

    it 'should be able to be liked by an user' do
      expect(@post.likes_count).to eq(0)
      @post.liked_by(@user)
      expect(@post.likes_count).to eq(1)
    end

    it 'should be able to be unliked by an user' do
      @post.likes.destroy_all # ensures likes_count is zero
      @post.liked_by(@user)
      expect(@post.likes_count).to eq(1)
      @post.unliked_by(@user)
      expect(@post.likes_count).to eq(0)
    end
  end

end
