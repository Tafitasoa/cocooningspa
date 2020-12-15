class AddColumnToOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :send_mail, :boolean, default:false
  end
end
