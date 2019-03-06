class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    respond_to do |format|
      format.html
      format.json do
        if user
          render json: { user: user, status: 200 }
        else
          render json: { status: 500 }
        end
      end
    end
  end

  private

  def user
    @user = User.find_by(username: params[:username])
  end
end
