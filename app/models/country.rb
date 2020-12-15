class Country < ApplicationRecord
	has_many :departments, dependent: :destroy #relation pays(country)-departement
	#une commande est dans un département
	has_many :orders
	# relation Service N-N Country
	has_many :service_countries
	has_many :services, through: :service_countries
	#relation Prestataire N-N Country
	has_many :prestataire_countries
	has_many :prestataires, through: :prestataire_countries

	validates :name, presence: true
end
