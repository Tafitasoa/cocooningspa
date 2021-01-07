class ApplicationMailer < ActionMailer::Base

  default from: 'contact@cocooningspa.com'
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
      logger.debug "[ERROR] #{exception}, \nCODE: #{exception.error_code} , \nMESSAGE #{exception.message}"
    end

end