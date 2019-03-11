class AdminMailer < ApplicationMailer
  default from: 'ricardovillagranal@gmail.com'
  
  def daily
    @admin = User.find_by(username: :admin)
    @total_users = User.all.size
    @total_likes = Like.all.size
    @total_follows = Follow.all.size

    mail(to: @admin.email, subject: "Hi #{@admin.name}, daily stats for you!")
  end

end
