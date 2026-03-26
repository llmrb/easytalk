# frozen_string_literal: true

require "setup"

class BaseRouteTest < Relay::Test
  def test_root_path_raises_without_request_delegation
    assert_raise(NameError) do
      get "/"
    end
  end

  def test_unknown_get_route_returns_404
    get "/nonexistent-route"
    assert_equal 404, last_response.status
  end
end
