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


	# Fonction qui valide le nom de domaine des emails
	validate :valid_email?
	def valid_email?
		begin
		domain_name = Mail::Address.new(email).domain
		domain_valid?(domain_name)

		#Compte les emails validés
		@nbrmail = CountEmail.new
	    @nbrmail.email = email
	    @nbrmail.description = "Mail de contact avec succès"
	    @nbrmail.save
	    @count = CountEmail.select('id').group("date_trunc('month', created_at)").count	 
	    @count.each do |m|
	       @nbrmail.update(countpermonth: m[1], month: m[0].strftime("%b")) 
	   	end

		rescue
		
		end
	end

	def domain_valid?(domain)
		Resolv::DNS.open do |dns|
		@mx = dns.getresources(domain.to_s, Resolv::DNS::Resource::IN::MX)
		end

		if @mx.empty?
			logger.debug "[DEBUG] - Le nom de domaine de #{email} n'est pas validé."
			errors.add("Votre email", "n'exite pas")
		end
	end

	# private
	# def message_send
	# 	AdminMailer.contac_us(self).deliver_now
	# end
	
end


