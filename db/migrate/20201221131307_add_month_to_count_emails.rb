class AddMonthToCountEmails < ActiveRecord::Migration[6.0]
    def change
      add_column :count_emails, :month, :string
    end
  end
  