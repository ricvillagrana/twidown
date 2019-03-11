class FollowerEmailJob
  @queue = :follow_email_job

  def self.perform(following_id, follower_id)
    following = User.find following_id
    follower  = User.find follower_id

    NewFollowerMailer.new_follower(following, follower).deliver
  end
end
