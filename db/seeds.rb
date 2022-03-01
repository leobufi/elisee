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
    artist: track.album.artists.map {|art| art.name}.join(', '),
    album: track.album.name,
    duration: track.audio_features.duration_ms*60_000,
    key: track.audio_features.key,
    mode: track.audio_features.mode,
    tempo: track.audio_features.tempo,
    spotify_id: track.id,
    time_signature: track.audio_features.time_signature,
    loudness: track.audio_features.loudness
  )
  puts "1 song created"
end
puts "Pfiou....quel boulot...."
puts "j'en suis fort aise"
