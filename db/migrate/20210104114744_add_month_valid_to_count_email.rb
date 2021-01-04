class AddMonthValidToCountEmail < ActiveRecord::Migration[6.0]
  def change
    add_column :count_emails, :monthvalid, :string
  end
end
