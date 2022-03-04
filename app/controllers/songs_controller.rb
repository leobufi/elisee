class SongsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:autocomplete, :show]
  helper_method :already_liked?

  def index
    @songs = Song.all
  end

  def show
    @song = Song.find(params[:id])
    if already_liked?
      @like = Like.where(user_id: current_user.id, song_id: params[:id]).first
    else
      @like = Like.new
    end
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

  def destroy
    @song = Song.find(params[:id])
    @song.destroy
  end

  def like
    @song = Song.find(params[:id])
    Like.create(user_id: current_user.id, song_id: @song.id)
    redirect_to song_path(@song)
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

  def already_liked?
    Like.where(user_id: current_user.id, song_id: params[:id]).exists?
  end
end
