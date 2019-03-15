require 'rails_helper'

RSpec.describe PostsController, type: :controller do

  before :all do
    @user = create :user
    @following = create :user

    @user.follow!(@following)

    @user.posts.create(build(:post).attributes)
    @following.posts.create(build(:post).attributes)

    @post = create(:post, user_id: @user.id)
  end

  context 'Test endpoints' do
    it { should route(:post, '/posts').to(action: :create) }
    it { should route(:get, '/posts').to(action: :index) }
    it { should route(:put, '/posts/1').to(action: :update, id: 1) }
    it { should route(:delete, '/posts/1').to(action: :destroy, id: 1) }
  end

  context 'GET posts#index' do
    context 'respond_to' do
      it 'respond as text/html' do
        get :index
        expect(response.content_type).to eq "text/html" 
      end
      
      it 'respond as application/json' do
        get :index, { format: 'json' }
        expect(response.content_type).to eq "application/json"
      end
    end

    context 'User feed' do
      it 'cannot access feed before sign in' do
        get :index, { format: 'json' }
        expect(response.body).to match(/need to sign in or sign up before continuing/)
      end

      it 'has posts of current user in the feed' do
        sign_in(@user)
        get :index, { format: 'json' }
        expect(response.body).to match(eval("/#{@user.posts.first.content}/mi"))
      end

      it 'has posts of followings in the feed' do
        sign_in(@user)
        get :index, { format: 'json' }
        expect(response.body).to match(eval("/#{@following.posts.first.content}/mi"))
      end
    end
  end

  context 'POST posts#create' do
    
    it 'should create a post even if not post_id and repost_id are presents' do
      sign_in(@user)
      post :create, params: { post: { content: 'This is my post' } }
      expect(response.body).to match(/my post/mi)
    end

    it 'should not create a post if content is blank' do
      sign_in(@user)
      post :create, params: { post: { content: '' } }
      expect(response.body).to match(/1 character/mi)
    end

    it 'should include the post_id for commenting on other post' do
      sign_in(@user)
      post :create, params: { post: { content: 'content', post_id: @post.id } }
      expect(response.body).to match(eval("/post_id\\\":#{@post.id}/mi"))
    end

    it 'should include the repost_id for reposting' do
      sign_in(@user)
      post :create, params: { post: { content: 'content', repost_id: @post.id } }
      expect(response.body).to match(eval("/repost_id\\\":#{@post.id}/mi"))
    end
  end

  context 'PUT posts#update' do
    it 'update a post by passing the id and the new content' do
      sign_in(@user)
      user_post = @user.posts.first
      put :update, params: { id: user_post.id, post: { id: user_post.id, content: 'new_content' } }
      expect(Post.find(user_post.id).content).to eq('new_content')
    end
  end

  context 'DELETE posts#destroy' do
    it 'deletes a post by passing the id' do
      sign_in(@user)
      posts_count = @user.posts.size
      delete :destroy, params: { id: @user.posts.first.id }
      expect(@user.posts.size).to eq(posts_count - 1)
    end
  end

  context 'Like/Unlike posts' do
    it 'can like posts' do
      sign_in(@user)
      user_post = @user.posts.first
      likes = user_post.likes_count
      post :like, params: { id: user_post.id }
      expect(Post.find(user_post.id).likes_count).to eq(likes + 1)
    end

    it 'can unlike posts' do
      sign_in(@user)
      user_post = @user.posts.first
      post :like, params: { id: user_post.id }
      likes = Post.find(user_post.id).likes_count
      delete :dislike, params: { id: user_post.id }
      expect(Post.find(user_post.id).likes_count).to eq(likes - 1)
    end
  end

end
