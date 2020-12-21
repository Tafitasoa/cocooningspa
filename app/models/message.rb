class Message < ApplicationRecord
	require 'resolv'
	# after_create :message_send
	# Call Module EmailValidatable
	include EmailValidatable
	

	validates :first_name, presence: true
	validates :last_name, presence: true
	validates :tel, presence: true
	# validates :email, email: { no_sub_addressed: true, recorded: true, blacklisted: true }
	validates :content, presence: true

	validate :valid_email?
	def valid_email?
		begin
		domain_name = Mail::Address.new(email).domain
		domain_valid?(domain_name)
		rescue
		errors.add("Votre email", "n'existe pas")
		end
	end

	def domain_valid?(domain)
		Resolv::DNS.open do |dns|
		@mx = dns.getresources(domain.to_s, Resolv::DNS::Resource::IN::MX)
		end
		if @mx.empty?
		logger.debug "[DEBUG] - Domain name #{email} has a problem."
		errors_add(:email, 'domain name can not be found.')
		end
	end

	# private
	# def message_send
	# 	AdminMailer.contac_us(self).deliver_now
	# end
	
end


