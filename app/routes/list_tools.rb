# frozen_string_literal: true

module Relay::Routes
  class ListTools < Base
    ##
    # @return [String]
    def call
      partial("fragments/tools", {locals: {tools: LLM::Tool.registry}})
    end
  end
end
