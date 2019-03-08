class FollowerEmailJob
  @queue = :follow_email_job

  def self.perform(following_id, follower_id)
    Resque.logger = Logger.new("#{Rails.root}/log/resque.log")
    Resque.logger.level = Logger::DEBUG

    following = User.find following_id
    follower  = User.find follower_id
    Resque.logger.info "Sending email to #{following.name}[id: #{following.id}] because #{follower.name}[id: #{follower.id}] followed them."

    NewFollowerMailer.new_follower(following, follower).deliver
  end
end
