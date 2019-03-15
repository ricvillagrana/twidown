require 'rails_helper'

RSpec.describe PagesController, type: :controller do
  #render_views

  before :all do
    @user = create :user
  end

  context 'GET pages#index' do
    it 'redirects to login not logged in' do
      get :index
      expect(response).to redirect_to('/users/sign_in')
    end
    
    it 'shows the feed if logged in' do
      sign_in(@user)
      get :index
      expect(get: "/").to route_to(controller: 'pages', action: 'index')
      expect(response.status).to eq(200)
      expect(response).to render_template('index')
    end
  end

  context 'GET pages#people' do
    it 'shows the people page' do
      sign_in(@user)
      get :people
      expect(get: "/people").to route_to(controller: 'pages', action: 'people')
      expect(response.status).to eq(200)
      expect(response).to render_template('people')
    end
  end
end
