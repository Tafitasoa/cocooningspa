class ApplicationMailer < ActionMailer::Base

  default from: 'tafitasoa.cedric@gmail.com'
  layout 'mailer'

  SMTP_ERRORS = [
    IOError,
    Net::SMTPAuthenticationError,
    Net::SMTPServerBusy,
    Net::SMTPUnknownError,
    TimeoutError,
    Net::SMTPFatalError, 
    Net::SMTPSyntaxError
  ]
  rescue_from *SMTP_ERRORS, with: :show_errors

  private
    def show_errors(exception)
      logger.debug "[ERROR APPLICATION MAILER] Class: #{exception.class},\nMessage #{exception.message}"
    end

end