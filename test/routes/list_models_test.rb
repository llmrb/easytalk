# frozen_string_literal: true

require "setup"

class ListModelsRouteTest < Relay::Test
  def test_list_models_route_is_not_defined_under_api_namespace
    get "/api/models"
    assert_equal 404, last_response.status
  end

  def test_models_route_redirects_unauthenticated_users_to_sign_in
    get "/models"
    assert_equal 302, last_response.status
    assert_equal "/sign-in", last_response.headers["Location"]
  end
end
