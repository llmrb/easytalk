# frozen_string_literal: true

module Server::Routes
  class ListTools < Base
    ##
    # @return [String]
    def call
      response["content_type"] = "application/json"
      LLM::Tool.registry.map do
        { "name" => _1.name, "description" => _1.description }
      end.to_json
    end
  end
end
