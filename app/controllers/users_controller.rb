class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.everyone_but(current_user)
    respond_to do |format|
      format.html
      format.json { render json: { users: @users, status: 200 } }
    end
  end

  def show
    @user = user
    respond_to do |format|
      format.html
      format.json do
        render json: { status: 500 } unless user
      end
    end
  end

  def follow
    user = User.find(params[:id])
    if current_user.follow(user)
      #FollowerEmailJob.perform(user.id, current_user.id)
      Resque.enqueue(FollowerEmailJob, user.id, current_user.id)
      #NewFollowerMailer.new_follower(user, current_user).deliver
      render json: { followed: user, follower: current_user, status: 200} 
    else
      render json: { status: 500 }
    end
  end

  def unfollow
    user = User.find(params[:id])
    if current_user.unfollow(user)
      render json: { unfollowed: user, follower: current_user, status: 200}
    else
      render json: { status: 500 }
    end
  end

  private

  def user
   User.find_by(username: params[:username])
  end
end
