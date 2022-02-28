class CreateSongs < ActiveRecord::Migration[6.1]
  def change
    create_table :songs do |t|
      t.string :name
      t.string :artist
      t.string :album
      t.float :duration
      t.integer :key
      t.integer :mode
      t.float :tempo
      t.string :spotify_id
      t.integer :time_signature
      t.float :loudness

      t.timestamps
    end
  end
end
