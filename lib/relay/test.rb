# frozen_string_literal: true

module Relay
  class Test < Test::Unit::TestCase
    include Rack::Test::Methods

    def app
      Relay::Router.freeze.app
    end
  end
end
