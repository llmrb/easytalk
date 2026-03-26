# frozen_string_literal: true

require "setup"

class ListModelsRouteTest < Relay::Test
  def test_models_route_redirects_unauthenticated_users_to_sign_in
    get "/models"
    assert_equal 302, last_response.status
    assert_equal "/sign-in", last_response.headers["Location"]
  end
end
