class NewFollowerMailer < ApplicationMailer
  default from: 'ricardovillagranal@gmail.com'

  def new_follower(following, follower)
    @following = following
    @follower = follower
    mail(to: following.email, subject: "#{follower.name} (@#{follower.username}) now follows you!")
  end
end
