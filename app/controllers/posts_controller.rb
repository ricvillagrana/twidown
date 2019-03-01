class PostsController < ApplicationController

  def index
    @posts = current_user.posts + current_user.following_posts 
    respond_to do |format|
      format.html
      format.json {render json: { posts: @posts } }
    end
  end

end
