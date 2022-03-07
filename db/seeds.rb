require 'rspotify'
require 'open-uri'
require 'json'

Song.destroy_all
puts "cleaning previous db..."

RSpotify.authenticate(ENV["CLIENT_ID"], ENV["CLIENT_SEC"])
playlist = RSpotify::Playlist.find_by_id('7DkUTJSiWwbyeTSKsD1fYo')

playlist.tracks.each do |track|
  sleep 1
  Song.create!(
    name: track.name,
    artist: track.album.artists.map {|a| a.name}.join(', '),
    album: track.album.name,
    duration: track.audio_features.duration_ms/1000,
    key: track.audio_features.key,
    mode: track.audio_features.mode,
    tempo: track.audio_features.tempo,
    spotify_id: track.id,
    time_signature: track.audio_features.time_signature,
    loudness: track.audio_features.loudness,
    acousticness: track.audio_features.acousticness,
    danceability: track.audio_features.danceability,
    energy: track.audio_features.energy,
    instrumentalness: track.audio_features.instrumentalness,
    valence: track.audio_features.valence,
  )
  puts "1 song created"
end

puts "new user online" if User.create!(email: 'creator2@elisee.wow', password: '123456')

puts "pfiou....quel boulot...."
puts "j'en suis fort aise"
