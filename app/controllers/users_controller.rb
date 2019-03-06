class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    @user = user
    respond_to do |format|
      format.html
      format.json do
        unless user
          render json: { status: 500 }
        end
      end
    end
  end

  private

  def user
   User.find_by(username: params[:username])
  end
end
