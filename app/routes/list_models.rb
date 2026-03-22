# frozen_string_literal: true

module Relay::Routes
  class ListModels < Base
    ##
    # Returns the chat-capable models for the provider
    # @return [Array]
    def call
      cache.models = filter(llm.models.all)
      partial("partials/models", {locals:})
    end

    private

    def locals
      {models: cache.models, current_model: session["model"]}
    end

    def filter(models)
      models.select(&:chat?)
    end
  end
end
