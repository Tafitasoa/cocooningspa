class DeveloperMailer < ApplicationMailer

  require 'json'

  def notify_unsuccessfull_mail(raised_error, client_id)
    logger.info "\n\n ################################# \n DeveloperMailer: notify_unsuccessfull_mail \n\n"

    @error = raised_error
    @client = Client.find(client_id).to_json

    # send mail
    mail(to: 'tafitasoa.cedric@gmail.com', subject: 'CCSPA: Error while sending confirmation order')
  end


end
