class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: user_params)
    devise_parameter_sanitizer.permit(:account_update, keys: user_params)
    devise_parameter_sanitizer.permit(:sign_in, keys: user_params)
  end

  def user_params
    %i[ first_name last_name phone_number address  ].freeze
  end
end
