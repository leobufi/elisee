class AddStatusToLikes < ActiveRecord::Migration[6.1]
  def change
    add_column :likes, :status, :boolean, default: false
  end
end
