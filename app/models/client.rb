class Client < ApplicationRecord

	require 'resolv'
	# after_create :message_send
	# Call Module EmailValidatable
	include EmailValidatable
	# after_create :send_email_to_client

  has_many :orders, dependent: :destroy # un client 1 ---- N  commande

	validates :first_name, presence: true
	validates :last_name, presence: true
	validates :adresse, presence: true
	validates :tel, presence: true
	validates :sexe, presence: true
	validates :country, presence: true
	validates :zip_code, presence: true

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable

  	devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

    # Fonction qui valide le nom de domaine des emails
	validate :valid_email?
	def valid_email?
		begin
		domain_name = Mail::Address.new(email).domain
		domain_valid?(domain_name)

		#Compte les emails validés
		@nbrmail = CountEmail.new
	    @nbrmail.email = email
	    @nbrmail.description = "Mail d'inscription avec succès"
	    @nbrmail.save
	    @count = CountEmail.select('id').group("date_trunc('month', created_at)").count	 
	    @count.each do |m|
	       @nbrmail.update(countpermonth: m[1], monthvalid: m[0].strftime("%b")) 
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


  	# def send_email_to_client
  	# 	ClientMailer.welcome_client(self).deliver_now
	# end

	# protected
	# def confirmation_required?
	# 	false
	# end


end
