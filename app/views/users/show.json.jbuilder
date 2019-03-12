json.user do
  json.id @user.id
  json.name @user.name
  json.username @user.username
  json.email @user.email
  json.options @user.options
  json.created_at @user.created_at
  json.updated_at @user.updated_at
  json.followers_count @user.followers.size
  json.following_count @user.following.size
  json.posts_count @user.posts.size
  json.posts do 
    json.array! @user.posts do |post|
      json.id post.id
      json.content post.content
      json.post_id post.post_id
      json.repost_id post.repost_id
      json.likes_count post.likes_count
      json.like_ids post.like_ids
      json.user post.user
      json.users do
        json.array! post.users do |user|
          json.id user.id
          json.name user.name
          json.username user.username
        end
      end
    end
  end
end
