class NotificationController < ApplicationController
    protect_from_forgery except: :verify_process_order
  def index  	
  	inf_id = params[:id].to_i
  	sup_id = Notification.lastIndex
  	@notifications = Notification.where(id:[inf_id..sup_id])
  end

  def update
  	@notification = Notification.find(params[:id])
  	@notification.update(is_view:true)
  	redirect_to admin_order_show_path(@notification.order_id)
  end

  def update_all
    Notification.all.update(is_view:true)
    redirect_back(fallback_location: root_path)
  end

  def verify_process_order
    order_lists = Order.where(is_validate:true)
    order_lists.each do |order|
      unless order.send_mail
# //////////////////////////////// ORIGINAL CODE COMMENTE /////////////////////////////////////       
        # send_email_now(order)
# ////////////////////////////////  FIN /////////////////////////////////////        
        order.update(send_mail:true)
      end
      date = order.prestation_date.split("/")
      is_past = false
      is_prestataire_empty = false
      order.order_services.each do |o_service|
        hours = o_service.service_time.split(":")
        current_time = Time.new(date[2], date[1], date[0], hours[0], hours[1])
        if current_time.past?
          is_past = true
        end
        if o_service.prestataire.nil?
          is_prestataire_empty = true
        end
      end
      if is_past && is_prestataire_empty
        order.update(status_order:'non traitée')
      end
    end
    
    render html: helpers.tag.strong('Email sended')
  end

  # //////////////////////////////// ORIGINAL CODE COMMENTE /////////////////////////////////////  
  #private

  # def send_email_now(order)
  #   order.services.each do |service|
  #     case service.name
  #       when "Location spa"
  #         mailToOrderServiceSpa = order.order_services.find_by(service_id:service.id)
  #         #====== Send email to prestataire location spa =====
  #         prestataires = []
  #         if order.department.nil?
  #           prestataires = Prestataire.where(statut: 'actif').joins(:services).where(services:{name:service.name}).joins(:countries).where(countries:{name:order.country.name})
  #         else
  #           prestataires = Prestataire.where(statut: 'actif').joins(:services).where(services:{name:service.name}).joins(:departments).where(departments:{name:order.department.name})
  #         end
  #         prestataires.each do |prestataire|
  #           PrestataireMailer.new_orderSpa(mailToOrderServiceSpa.id,prestataire.id).deliver_now
  #         end
  #       when "Massage"
  #         mailToOrderServiceMassage = order.order_services.find_by(service_id:service.id)
  #         #====== Send email to prestataire massage =====
  #         prestataires = []
  #         if order.department.nil?
  #           prestataires = Prestataire.where(statut: 'actif').joins(:services).where(services:{name:service.name}).joins(:countries).where(countries:{name:order.country.name})
  #         else
  #           prestataires = Prestataire.where(statut: 'actif').joins(:services).where(services:{name:service.name}).joins(:departments).where(departments:{name:order.department.name})
  #         end
  #         prestataires.each do |prestataire|
  #           if prestataire.sexe == order.praticien || order.praticien == "all"
  #             PrestataireMailer.new_orderMassage(mailToOrderServiceMassage.id,prestataire.id).deliver_now
  #           end
  #         end
  #       else
  #     end
  #   end
  #   ClientMailer.confirm_order(order.id,order.client.id).deliver_now
  # end
# ////////////////////////////////  FIN ///////////////////////////////////// 
end
