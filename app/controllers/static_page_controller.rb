class StaticPageController < ApplicationController
#page d'acceuil
  def index
    @commentsAccueil = Comment.where(comment_for:"accueil")
  end
#Differents service {+ Page Service Par Departement}
  def massage
    @massages = MassageSu.all
    @commentsMassage = Comment.where(comment_for:"massage")
  end

  def location_spa
    @commentsSpa = Comment.where(comment_for:"spa")
  end
# Devenir partenaire inscription prestataire
  def partner
    @services = Service.all
    @countries = Country.all
    @departments = Department.all
  end

  def savePartner
    @candidate = Candidate.new
    @candidate.sexe = params["sex"]
    @candidate.first_name = params["first_name"]
    @candidate.last_name = params["last_name"]
    @candidate.date_of_birth = params["date"]
    @candidate.raison_sociale = params["raison_sociale"]
    @candidate.siren = params["siret"]
    @candidate.email = params["email"]
    @candidate.telephone = params["tel"]
    @candidate.adresse = params["adresse"]
    @candidate.adresse_complet = params["adresse_complet"]
    @candidate.zip_code = params["zip_code"]
    @candidate.ville = params["town"]
    @candidate.country = params["country"]
    if params["service"]
      @candidate.services = params["service"].join('|')
    end

    if params["countries"]
      if params["countries"].include?("France")
        if params["departments"]
          @candidate.departments = params["departments"].join('|')
          @candidate.countries = params["countries"].join('|')
        else
          @candidate.save
          flash[:list_message_errors] = @candidate.errors.full_messages
          flash[:list_message_errors].push("Si vous choisissez France, veuillez cocher au moins une de ces départements")
          redirect_back(fallback_location: root_path)
          return
        end
      else
        @candidate.countries = params["countries"].join('|')
      end
    end

    if @candidate.save
      AdminMailer.new_partner(@candidate).deliver_now
      PrestataireMailer.new_candidate(@candidate).deliver_now
      flash[:notice] = "Merci pour votre inscription! un message vous est envoyé dans à votre email pour poursuivre l'inscription veuillez bien le lire s'il vous plaît!"
      redirect_to cgu_path
    else
      
      # compter les emails invalid

      # @nbrmailinvalid = CountInvalidEmail.new
      # @nbrmailinvalid.email = params["email"]
      # @nbrmailinvalid.description = @candidate.errors.full_messages
      # @nbrmailinvalid.save

      #   @countinvalid = CountInvalidEmail.select('id').group("date_trunc('month', created_at)").count 
        
      
      #   @countinvalid.each do |i|
      #      @nbrmailinvalid.update(countpermonthinvalid: i[1], monthinvalid: i[0].strftime("%b")) 
      #   end

      flash[:danger] = @candidate.errors.full_messages
      redirect_back(fallback_location: root_path)
    end
  end

#Autre page
  def contact
  end

  def legalnotice
  end

  def cgu
  end

   def galery
  end
  # telechargement du doc cgu en pdf
  def dataDowCgu
    send_file(
      "#{Rails.root}/public/data_cgu/CGU_CCSPA.pdf",
      filename: "cgu_cocooning_spa.pdf",
      type: "application/pdf"
    )
  end

  #page faq
  def faq
  end

  def engagement
  end

  def propos
  end

  def save_message
    @message = Message.new
    @message.first_name = params["first_name"]
    @message.last_name = params["last_name"]
    @message.email = params["email"]
    @message.tel = params["mobile"]
    @message.name_corp = params["corp_name"]
    @message.content = params["content"]
    if @message.save
      logger.info "Processing the send mail..."
      flash[:success] = "Votre message a été bien envoyé, on vous contactera très bientôt"
      AdminMailer.contac_us(@message).deliver_now
      redirect_back(fallback_location: root_path)

    else
      logger.info "Processing the send mail failed..."

      # # compter les emails invalid
      # @nbrmailinvalid = CountInvalidEmail.new
      # @nbrmailinvalid.email = params["email"]
      # @nbrmailinvalid.description = @message.errors.full_messages #params["content"]
      # @nbrmailinvalid.save

      #   @countinvalid = CountInvalidEmail.select('id').group("date_trunc('month', created_at)").count 
        
      
      #   @countinvalid.each do |i|
      #      @nbrmailinvalid.update(countpermonthinvalid: i[1], monthinvalid: i[0].strftime("%b")) 
      #   end

      flash[:danger] = @message.errors.full_messages
      redirect_back(fallback_location: root_path)
    end
  end


end
