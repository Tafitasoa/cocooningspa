require 'mail'
# require 'resolv' #”gem install resolv-ipv6favor“

module EmailValidatable
  extend ActiveSupport::Concern

    class EmailValidator < ActiveModel::EachValidator

        EmailAddress = begin
            qtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]'
            dtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]'
            atom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-' +
            '\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+'
            quoted_pair = '\\x5c[\\x00-\\x7f]'
            domain_literal = "\\x5b(?:#{dtext}|#{quoted_pair})*\\x5d"
            quoted_string = "\\x22(?:#{qtext}|#{quoted_pair})*\\x22"
            domain_ref = atom
            sub_domain = "(?:#{domain_ref}|#{domain_literal})"
            word = "(?:#{atom}|#{quoted_string})"
            domain = "#{sub_domain}(?:\\x2e#{sub_domain})*"
            local_part = "#{word}(?:\\x2e#{word})*"
            addr_spec = Regexp.new("#{local_part}\\x40#{domain}", nil, 'n')
            pattern = /\A#{addr_spec}\z/
        end

        # def validate_each(record, attribute, value)
        #     unless value =~ EmailAddress
        #       record.errors[attribute] << (options[:message] || "is not valid") 
        #     end
        # end

        # def validate_each(record, attribute, value)
        #     address = Mail::Address.new(value)
        #     record.errors[attribute] << (options[:message] || 'is invalid') unless (address.address == value > 1 rescue false)
        # end

        # def add_error(record, attribute)
        #     record.errors.add(attribute, (options[:message] || "is not a valid email address"))
        # end
        
        # def validate_each(record, attribute, value)
        #     begin
        #     a = Mail::Address.new(value)
        #     rescue Mail::Field::ParseError
        #     add_error(record, attribute)
        #     end   

        #     # email = “foo@example.com” #test with valid email
        #     # value = a.address
        #     # split_email = email.split(“@”) #split string with “@”
        #     # domain = split_email[1].to_s #get domain name
        #     # if email =~ (/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i)
        #     # #checking domain name
        #     # Resolv::DNS.open do |dns|
        #     # @staus = dns.getresources(domain, Resolv::DNS::Resource::IN::MX)
        #     # end
        #     # else
        #     # errors_add(:email, ‘domain name can not be found.’)
        
        #     # regexp from http://guides.rubyonrails.org/active_record_validations.html
        #     value = a.address unless a.nil?
        #     # split_email = value.split("@") #split string with “@”
        #     # domain = split_email[1].to_s #get domain name
        #     # if value =~ (/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i)
        #     #     #checking domain name
        #     #     Resolv::DNS.open do |dns|
        #     #     @staus = dns.getresources(domain, Resolv::DNS::Resource::IN::MX)
        #     #     end
        #     # else
        #     #     add_error(:email, 'domain name can not be found.')
        #     unless value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i 
        #         add_error(record, attribute)
        #     end
        # end
    end
end