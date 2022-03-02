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

  def autocomplete
    @songs = Song.where("artist ILIKE '%#{params[:q]}%' OR name ILIKE '%#{params[:q]}%' OR album ILIKE '%#{params[:q]}%'")
    render partial: 'songs/autocomplete', locals: { search_results: @songs }, layout: false, formats: %i[html]
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
