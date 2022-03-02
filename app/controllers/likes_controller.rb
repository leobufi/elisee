class LikesController < ApplicationController
  before_action :find_song
  before_action :find_like, only: [:destroy]

  def new
    @like = Like.new
  end

  def create
    if already_liked?
      flash[:notice] = 'You like it already!'
    else
      @like = Like.new
      @like.song = @song
      @like.user = current_user
      @like.update(status: true)
      flash[:notice] = 'Saved to your dashboard'
    end
  end

  def destroy
    if !(already_liked?)
      flash[:notice] = "Can't unlike this"
    else
      @like.destroy
    end
    redirect_to song_path(@song)
  end

  private

  def find_song
    @song = Song.find(params[:song_id])
  end

  def find_like
    @like = @song.likes.find(params[:id])
  end

  def already_liked?
    Like.where(user_id: current_user.id, song_id: params[:song_id]).exists?
    # WOULD --- Like.self.new_record? ---- WORK TOO ?
  end
end
