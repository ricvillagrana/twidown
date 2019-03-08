class FollowerEmailJob < ApplicationJob
  queue_as :default

  @queue = :follow_email_job

  def perform(args)
    Resque.logger = Logger.new("#{Rails.root}/log/resque.log")
    Resque.logger.level = Logger::DEBUG

    following = User.find args[:following_id]
    follower  = User.find args[:follower_id]
    Resque.logger.info "Sending email to #{following.name}[id: #{following.id}] because #{follower.name}[id: #{follower.id}] followed them."

    NewFollowerMailer.new_follower(following, follower)
  end
end
