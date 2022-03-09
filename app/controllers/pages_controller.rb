class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: :home

  def home
    if params[:query].present?
      sql_query = "name ILIKE :query OR artist ILIKE :query OR album ILIKE :query"
      @songs = Song.where(sql_query, query: "%#{params[:query]}%")
    else
      @songs = Song.all
    end
  end

  def dashboard
    @song = Song.new
    @songs = current_user.songs
    @like = Like.new
    @likes = current_user.likes
  end

  def project
  end
end
