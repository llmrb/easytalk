# frozen_string_literal: true

module Relay::Routes
  class Settings::SetModel < Base
    def call
      set_model
      partial("fragments/settings/set_model", locals:)
    end

    private

    def set_model
      session["model"] = params["model"]
    end

    def locals
      {models: cache.models, current_model: session["model"]}
    end
  end
end
