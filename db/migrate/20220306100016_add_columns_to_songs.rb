class AddColumnsToSongs < ActiveRecord::Migration[6.1]
  def change
    add_column :songs, :acousticness, :float
    add_column :songs, :danceability, :float
    add_column :songs, :energy, :float
    add_column :songs, :instrumentalness, :float
    add_column :songs, :valence, :float
  end
end
