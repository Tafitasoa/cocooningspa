class Candidate < ApplicationRecord
	require 'resolv'
	include EmailValidatable
	# after_create :message_send_to_admin_and_self

	validates :sexe, presence: true
	validates :first_name, presence: true
	validates :last_name, presence: true
	validates :date_of_birth, presence: true
	# validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
	validates :telephone, presence: true
	validates :adresse, presence: true
	validates :zip_code, presence: true
	validates :ville, presence: true
	validates :country, presence: true
	validates :services, presence: true
	validates :countries, presence: true

	# Fonction qui valide le nom de domaine des emails
	validate :valid_email?
	def valid_email?
		begin
		domain_name = Mail::Address.new(email).domain
		domain_valid?(domain_name)

		#Compte les emails validés
		@nbrmail = CountEmail.new
	    @nbrmail.email = email
	    @nbrmail.description = "Mail de candidat avec succès"
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
	
	# def message_send_to_admin_and_self
	# 	AdminMailer.new_partner(self).deliver_now
	# 	PrestataireMailer.new_candidate(self).deliver_now
	# end
end
