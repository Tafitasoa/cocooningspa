class Message < ApplicationRecord

	# after_create :message_send
	# before_create :mssg

	

	validates :first_name, presence: true
	validates :last_name, presence: true
	validates :tel, presence: true
	validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
	validates :content, presence: true



	

	# private
	# # def message_send
	# # 	AdminMailer.contac_us(self).deliver_now
	# # end

	# def mssg
	# 	if self.email == "michael77rakotovao@gmail.com"
	# 		AdminMailer.contac_us(self).deliver_now		
	# 	else

	# 		puts "AHAHAHAHAHAHAHAAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAH"
	# 		exit
	# 	end

	# end
end


