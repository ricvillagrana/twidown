require 'rails_helper'
require 'json'

RSpec.describe UsersController, type: :controller do

  before :all do
    @user = create :user
    @follow = create :user

    Random.rand(3).times { create(:user) }
  end

  context 'Test endpoints' do
    it { should route(:get, '/users').to(action: :index) }
  end

  context 'GET users#index' do
    
    context 'respond_to' do
      it 'respond as text/html' do
        get :index
        expect(response.content_type).to eq "text/html" 
      end
      
      it 'respond as application/json' do
        get :index, { format: :json }
        expect(response.content_type).to eq "application/json"
      end
    end

    it 'show all users current user is following' do
      sign_in(@user)
      total = User.all.size
      get :index, { format: :json }
      expect(JSON.parse(response.body)['users'].size).to eq(total - 1)
    end
  end

  context 'GET users#show' do
    context 'respond_to' do
      it 'respond as text/html' do
        get :index
        expect(response.content_type).to eq "text/html" 
      end
      
      it 'respond as application/json' do
        get :index, { format: :json }
        expect(response.content_type).to eq "application/json"
      end
    end
    
    it 'renders the show template' do
      sign_in(@user)
      get :show, params: { username: @user.username }
      should render_template :show
    end

    it 'renders error json if username is not valid' do
      sign_in(@user)
      get :show, format: :json, params: { username: 'username that doesn\'t exist' }
      expect(response.body).to match(/status":500/mi)
    end

    it 'follows a user when sending the id to follow' do
      sign_in(@user)
      post :follow, params: { id: @follow.id }
      expect(response.body).to match(/followed/mi)
    end

    it 'unfollows a user when sending the id to follow' do
      sign_in(@user)
      post :follow, params: { id: @follow.id }
      post :unfollow, params: { id: @follow.id }
      expect(response.body).to match(/followed/mi)
    end
  end

end
