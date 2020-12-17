class CreateCountInvalidEmails < ActiveRecord::Migration[6.0]
  def change
    create_table :count_invalid_emails do |t|
      t.string :email

      t.timestamps
    end
  end
end
