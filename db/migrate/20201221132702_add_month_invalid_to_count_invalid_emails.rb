class AddMonthInvalidToCountInvalidEmails < ActiveRecord::Migration[6.0]
  def change
    add_column :count_invalid_emails, :monthinvalid, :string
  end
end
