class Users::RegistrationsController < ApplicationController
  def create
   @user = User.new(user_params)

   if @user.save
    sign_in(@user)
    render json: { user: @user, status: 200 }
   else
    render json: { status: 500, errors: @user.errors.full_messages, message: 'Error when trying to sign up.' }
   end
  end

  private

  def user_params
    params.require(:user)
          .permit(:name, :username, :email, :password, :password_confirmation)
  end
end
