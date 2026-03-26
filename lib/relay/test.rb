# frozen_string_literal: true

require "test/unit"
require "rack/test"

ENV["RACK_ENV"] = "test"

module Relay
  class Test < Test::Unit::TestCase
    include Rack::Test::Methods

    def app
      Relay::Router.freeze.app
    end
  end
end
