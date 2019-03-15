require 'rails_helper'

RSpec.describe SessionsController, type: :controller do

  before :all do
    @user = create :user

    @unpersisted_user = -> do
      user = build(:user).as_json
      user[:password] = '123123'
      user[:password_confirmation] = '123123'
      user
    end
  end

  context 'GET sessions#show' do
    render_views

    it 'renders a application/json' do
      sign_in(@user)
      get :show
      expect(response.status).to eq(200)
      expect(response.content_type).to eq "application/json"
    end

    it 'has a user as json in its body' do
      sign_in(@user)
      get :show
      expect(response.body).to match(eval("/#{@user.name}/mi"))
    end
    
  end

  context 'POST sessions#login' do
    it 'receives username and password to login' do
      post :login, params: { user: { username: @user.username, password: '123123' } }
      expect(response.body).to match(eval("/#{@user.name}/mi"))
    end

    it 'fails if password is incorrect' do
      post :login, params: { user: { username: @user.username, password: '123INCORRECTONE123' } }
      expect(response.body).to match(/Wrong username or password/mi)
    end

    it 'fails if not provided username or password' do
      post :login, params: { user: { username: @user.username } }
      expect(response.body).to match(/Wrong username or password/mi)
    end
  end

  context 'POST sessions#create' do
    it 'creates a user when register' do
      user = @unpersisted_user.call
      post :create, params: { user: user }
      expect(response.body).to match(eval("/#{user[:name]}/mi"))
    end

    it 'shows error when password_confirmation doesn\'t match' do
      user = @unpersisted_user.call
      user[:password_confirmation] = '123123 incorrect'
      post :create, params: { user: user }
      expect(response.body).to match(/Password confirmation doesn't match/mi)
    end

    it 'shows error when password is blank' do
      user = build(:user).as_json
      post :create, params: { user: user }
      expect(response.body).to match(/Password can't be blank/mi)
    end

    it 'shows error when username is blank' do
      user = @unpersisted_user.call
      user['username'] = nil
      post :create, params: { user: user }
      expect(response.body).to match(/Username can't be blank/mi)
    end

    it 'shows error when email is blank' do
      user = @unpersisted_user.call
      user['email'] = nil
      post :create, params: { user: user }
      expect(response.body).to match(/Email can't be blank/mi)
    end
  end
end
