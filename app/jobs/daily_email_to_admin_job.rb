class DailyEmailToAdminJob
  @queue = :daily_email_to_admin

  def self.perform
    AdminMailer.daily.deliver
  end
end
