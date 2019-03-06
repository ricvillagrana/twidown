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
end
