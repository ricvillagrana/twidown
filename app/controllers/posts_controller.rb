class PostsController < ApplicationController

  def index
    @posts = current_user.posts + current_user.following_posts
    @posts.sort_by!(&:created_at).reverse!
    respond_to do |format|
      format.html
      format.json {render json: { posts: @posts }, include: [:user] }
    end
  end

  def create
    @post = current_user.posts.new(post_params)

    if @post.save
      render json: { status: 200, post: @post }
    else
      render json: { status: 500, errors: @post.errors.full_messages }
    end
  end

  def update
    if post.update!(post_params)
      render json: { status: 200, post: @post }
    else
      render json: { status: 500, errors: @post.errors.full_messages }
    end
  end

  def destroy
    if post.destroy
      render json: { status: 200 }
    else
      render json: { status: 500, errors: @post.errors.full_messages }
    end
  end

  private

  def post
    Post.find(params[:id])
  end

  def parsed_posts
    @posts.map do |post|
      post.content = MarkdownParser.parse(post.content)
      post
    end
  end

  def post_params
    params
      .require(:post)
      .permit(:content, :post_id)
  end

end
