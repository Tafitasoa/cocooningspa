class AddCountPerMonthToCountEmail < ActiveRecord::Migration[6.0]
  def change
    add_column :count_emails, :countpermonth, :integer
  end
end
