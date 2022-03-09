class Song < ApplicationRecord
  has_many :likes, dependent: :destroy
  has_many :users, through: :likes

  validates :name, presence: true
  validates :artist, presence: true
  validates :album, presence: true
  validates :spotify_id, presence: true

  KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  MODES = ['Minor', 'Major']

  include PgSearch::Model
  pg_search_scope :search_by_name_artist_and_album,
    against: [ :name, :artist, :album ],
    using: {
      tsearch: { prefix: true }
    }

  def danceability_level
    if danceability < 0.33
      "Not"
    elsif danceability < 0.67
      "Not really"
    else
      "Highly"
    end
  end

  def energy_level
    if energy < 0.33
      "Low"
    elsif energy < 0.67
      "Medium"
    else
      "High"
    end
  end
end
