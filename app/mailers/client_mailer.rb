class ClientMailer < ApplicationMailer
  require 'json'
  def confirm_order(order_id,client_id)
    logger.info "\n\n ################################# \n def confirm_order(order_id,client_id) \n\n"

    @client = Client.find(client_id)
    @order = Order.find(order_id)

    # DATA: date: string, heurs: ["",""], number_service: number, code_promo: number
    @date = @order.prestation_date
    @heurs = ["",""]
    @number_service = 0
    @order.order_services.each do |o_s|
      @number_service += 1
    	if o_s.service.name == "Location spa"
    		@heurs[0] = o_s.service_time
    	elsif o_s.service.name == "Massage"
    		@heurs[1] = o_s.service_time
    	end
    end
    @code_promo = 0
    if @order.code_promo
      @code_promo = @order.code_promo.reduction
    end

    # send mail
    logger.info "\n\n ################################# \n DATA SEND MAIL \n\n"
    logger.info "\n\norder: #{@order.to_json}\nclient: #{@client.to_json}\ndate: #{@date}\nheurs: #{@heurs}\nnumber_service: #{@number_service}\ncode_promo #{@code_promo}"
    logger.info "\n\n ################################# \n START SEND MAIL \n\n"
    mail(to: @client.email, subject: 'Votre commande Cocooning Spa !')
  end

  def abandoned_order
  end

  def welcome_client(client)
    @client = client
    mail(to: @client.email, subject: 'Votre compte client a bien été créé !')
  end
end
