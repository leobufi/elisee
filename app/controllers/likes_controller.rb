class LikesController < ApplicationController
  before_action :find_song

  def new
    @song = Song.find(params[:song_id])
    @like = Like.new
  end

  def create
    @like = @song.likes.create(user_id: current_user.id)
    if @like.save
      redirect_to
    else
      render 'songs'
    end
  end

  private

  def find_song
    @song = Song.find(params[:song_id])
  end
end
