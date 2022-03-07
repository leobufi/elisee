class AddImageUrlToLikes < ActiveRecord::Migration[6.1]
  def change
    add_column :likes, :image_url, :text
  end
end
