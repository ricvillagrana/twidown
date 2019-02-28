class SessionsController < ApplicationController

  def show
    render json: { user: current_user } if user_signed_in?
  end
  
  def login
    @user = User.find_by_username(login_params[:username])
    
    if !@user.nil? && @user.valid_password?(login_params[:password])
      sign_in(@user)
      render json: { status: 200, user: @user }
    else
      render json: { status: 500, errors: ['Wrong username or password.'] }
    end
  end

  def create
   @user = User.new(user_params)

   if @user.save
    sign_in(@user)
    render json: { user: @user, status: 200 }
   else
    render json: { status: 500, errors: @user.errors.full_messages }
   end
  end

  private

  def user_params
    params.require(:user)
          .permit(:name, :username, :email, :password, :password_confirmation)
  end

  def login_params
    params.require(:user)
          .permit(:username, :password)
  end
end
