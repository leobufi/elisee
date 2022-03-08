class LikesController < ApplicationController
  def destroy
    @user = current_user
    @song = Song.find(params[:song_id])
    @like.song = @song
    @like = Like.find(params[:id])
    @like.destroy
  end
end
