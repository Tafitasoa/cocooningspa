class AdminOrderController < Application2Controller
	before_action :authenticate_admin!
  #before_action :validate_processed_order, only: [:processed,:notprocessed,:index]
  
  # page d'accueil du page admin(commande traitée)
  def processed
  	@order_lists = Order.where(is_validate:true)
    @orders_progress = @order_lists.where(status_order:'traitée')
  end

  # page d'accueil du page admin(commande non traitée)
  def notprocessed
    @order_lists = Order.where(is_validate:true)
    @orders_not_progress = @order_lists.where(status_order:'non traitée')
  end

  # page d'accueil du page admin(commande encours) 
  def index
    @order_lists = Order.where(is_validate:true)
    @orders_in_progress = @order_lists.where(status_order:'en cours')
  end

  # change le statut d'une commande
  def update_status_order
    order = Order.find(params['id'])
    order.update(status_order: params['status_order'])
    redirect_to admin_order_show_path(params['id'])
  end

  # affichage d'une commande
  def show
    @order = Order.find(params[:id])
    @code_promo = 0
    if @order.code_promo
      @code_promo = @order.code_promo.reduction
    end
    @spa_time = ""
    @massage_time = ""
    # list des prestataire invité
    @massage_prestataires = []
    @spa_prestataires = []
    # list des prestataire qui on répondu à l'invitation
    @massage_result_prestataire = []
    @spa_result_prestataire = []
    # ~~~~ 
    @order.services.each do |service|
      if @order.department.nil?
        tmpPrestataires = Prestataire.joins(:services).where(services:{name:service.name}).joins(:countries).where(countries:{name:@order.country.name})
      else
        tmpPrestataires = Prestataire.joins(:services).where(services:{name:service.name}).joins(:departments).where(departments:{name:@order.department.name})
      end
      current_order_service = @order.order_services.find_by(service_id:service.id)
      if service.name == "Massage"
        if @order.praticien == "all"
          @massage_prestataires = tmpPrestataires
        else
          @massage_prestataires = tmpPrestataires.where(sexe:@order.praticien)
        end
        @massage_result_prestataire = current_order_service.prestataire_orders
        @massage_time = current_order_service.service_time
      elsif service.name == "Location spa"
        @spa_prestataires = tmpPrestataires
        @spa_result_prestataire = current_order_service.prestataire_orders
        @spa_time = current_order_service.service_time
      end
    end
  end

  def afect_prestataire
    @prestataire = Prestataire.find(params[:id])
    @order = Order.find(params[:order_id])
    case params[:name]
      when "spa"
        @order_service = @order.order_services.find_by(service_id:Service.find_by_name("Location spa").id)
        unless @order_service.prestataire.nil?
          PrestataireMailer.delete_prestataire_for_order(@order_service.prestataire.id,@order.id).deliver_now
        end
        @order_service.update(prestataire:@prestataire,status_order:'traitée')
        @order.order_services.find_by(service_id:Service.find_by_name("Location spa").id).prestataire_orders.where(prestataire_id:@prestataire.id).destroy_all
        PrestataireMailer.accepted_orderSpa(@order_service.id,@prestataire.id).deliver_now
      when "massage"
        @order_service = @order.order_services.find_by(service_id:Service.find_by_name("Massage").id)
        unless @order_service.prestataire.nil?
          PrestataireMailer.delete_prestataire_for_order(@order_service.prestataire.id,@order.id).deliver_now
        end
        @order_service.update(prestataire:@prestataire,status_order:'traitée')
        @order.order_services.find_by(service_id:Service.find_by_name("Massage").id).prestataire_orders.where(prestataire_id:@prestataire.id).destroy_all
        PrestataireMailer.accepted_orderMassage(@order_service.id,@prestataire.id).deliver_now
      else
    end
    if @order.order_services.where(status_order:'en cours').empty? && @order.order_services.where(status_order:'non traitée').empty?
      @order.update(status_order:'traitée')
    end
    flash[:sucess] = "Le nouveau prestataire a été affecté à la commande"
    redirect_to admin_order_show_path(@order.id)
  end

  def delete_prestataire
    @prestataire = Prestataire.find(params[:id])
    @order = Order.find(params[:order_id])
    case params[:name]
    when "spa"
      @order.order_services.find_by(service_id:Service.find_by_name("Location spa").id).update(prestataire:nil,status_order:'en cours')
      @order.update(status_order:'en cours')
    when "massage"
      @order.order_services.find_by(service_id:Service.find_by_name("Massage").id).update(prestataire:nil,status_order:'en cours')
      @order.update(status_order:'en cours')
    else
    end
    PrestataireMailer.delete_prestataire_for_order(@prestataire.id,@order.id).deliver_now
    flash[:sucess] = "Le prestataire a été bien retiré de la commande"
    redirect_to admin_order_show_path(@order.id)
  end
end
