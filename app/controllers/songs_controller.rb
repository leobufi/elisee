class SongsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:autocomplete]
  helper_method :already_liked?

  def index
    @songs = Song.all
  end

  def show
    @song = Song.find(params[:id])
    # if already_liked?
    #   @like = Like.where(user_id: current_user.id, song_id: params[:id]).first
    # else
    # @like = Like.create(like_params)

    # end
    # @like.update(like_params)
    # json = { status: 'created' }
    # render json: json
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

  def attach_image_url
    @song = Song.find(params[:id])
    @user = current_user
    @like = @song.like
    @like.update_column(:image_url, params[:like][:image_url])
    head :ok
  end


  def destroy
    @song = Song.find(params[:id])
    @song.destroy
  end

  def like
    @song = Song.find(params[:song_id])
    @like = Like.create(user_id: current_user.id, song_id: @song.id)
    @like.update(like_params)
    json = { status: 'created', image_url: @like.image_url }
    render json: json
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
                                :loudness,
                                :acousticness,
                                :danceability,
                                :energy,
                                :instrumentalness,
                                :valence)
  end

  def like_params
    params.require(:like).permit(:image_url)
  end

  def already_liked?
    Like.where(user_id: current_user.id, song_id: params[:id]).exists?
  end
end
