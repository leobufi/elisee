class Song < ApplicationRecord
  has_many :likes
  has_many :users, through: :likes

  validates :name, presence: true
  validates :artist, presence: true
  validates :album, presence: true
  validates :spotify_id, presence: true

  include PgSearch::Model
  pg_search_scope :search_by_name_artist_and_album,
    against: [ :name, :artist, :album ],
    using: {
      tsearch: { prefix: true }
    }
end
