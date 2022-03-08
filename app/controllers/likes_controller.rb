class LikesController < ApplicationController
  def show
    @like = Like.find(params[:id])
    # render plain: like.image_url
    data = Base64.decode64(@like.image_url.gsub(/\Adata:image\/png;base64,/, ''))
    send_data data, filename: 'yourrender.png'
  end

  def destroy
    @like = Like.find(params[:id])
    @song = @like.song
    @like.destroy
    redirect_to dashboard_path
  end
end
