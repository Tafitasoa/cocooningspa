class AddDescriptionToCountEmails < ActiveRecord::Migration[6.0]
  def change
    add_column :count_emails, :description, :text
  end
end
