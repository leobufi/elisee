class PagesController < ApplicationController
  # skip_before_action :authenticate_user!, only: :home

  def home
    if params[:query].present?
      sql_query = "name ILIKE :query OR artist ILIKE :query OR album ILIKE :query"
      @songs = Song.where(sql_query, query: "%#{params[:query]}%")
    else
      # @songs = Song.all.reverse
    end
  end

  def dashboard
    # @songs = current_user.songs
    # @bookings = current_user.bookings.reverse
    # @requested_bookings = current_user.requested_bookings.reverse
    # @mountain = Mountain.new
  end

end
