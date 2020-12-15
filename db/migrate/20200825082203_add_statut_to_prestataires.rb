class AddStatutToPrestataires < ActiveRecord::Migration[6.0]
  def change
    add_column :prestataires, :statut, :string, default: 'actif'
  end
end
