class SongsController < ApplicationController
  def show
    @song = Song.find(params[:id])
  end

  def new
    @song = Song.new
  end

  def create
    @song = Song.new(song_params)
    @song.user = current_user
    if @song.save
      redirect_to song_path(@song)
    else
      render :new
    end
  end

  def index
    @songs = Song.all
  end

  def destroy
    @song = Song.find(params[:id])
    @song.destroy
  end

  private

  def song_params
    params.require(:song).permit(:name,
                                :artist,
                                :album,
                                :duration,
                                :key,
                                :mode,
                                :tempo,
                                :spotify_id,
                                :time_signature,
                                :loudness)
  end
end
