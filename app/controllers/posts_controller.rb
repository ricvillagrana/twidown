class PostsController < ApplicationController
  before_action :authenticate_user!

  def index
    @posts = current_user.posts + current_user.following_posts
    @posts.sort_by!(&:created_at).reverse!
    respond_to do |format|
      format.html
      format.json {
        render json: { posts: @posts }, 
        include: [
          :user,
          users: {
            only: [:name, :username]
          }
        ],
        methods: [:likes_count, :like_ids]
      }
    end
  end

  def create
    @post = current_user.posts.new(post_params)

    if @post.save
      Broadcast::Post.created(@post)
      render json: { status: 200, post: @post }
    else
      render json: { status: 500, errors: @post.errors.full_messages }
    end
  end

  def update
    if post.update!(post_params)
      Broadcast::Post.updated(post)
      render json: { status: 200, post: post }
    else
      render json: { status: 500, errors: post.errors.full_messages }
    end
  end

  def destroy
    deleted_post = post
    if post.comments.empty? && post.destroy
      Broadcast::Post.destroyed(deleted_post)
      render json: { status: 200 }
    else
      render json: { status: 500, errors: ['The post has comments, you cannot delete it!'] }
    end
  end

  def like
    if post.liked_by(current_user)
      Broadcast::Post.updated(post)
      render json: { status: 200 }
    else
      render json: { status: 500, errors: post.errors.full_messages }
    end
  end
  
  def dislike
    if post.unliked_by(current_user)
      Broadcast::Post.updated(post)
      render json: { status: 200 }
    else
      render json: { status: 500, errors: post.errors.full_messages }
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
