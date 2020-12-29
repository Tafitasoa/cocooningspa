class AddCountPerMonthInvalidToCountInvalidEmails < ActiveRecord::Migration[6.0]
  def change
    add_column :count_invalid_emails, :countpermonthinvalid, :integer
  end
end
