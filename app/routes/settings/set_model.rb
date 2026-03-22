# frozen_string_literal: true

module Relay::Routes::Settings
  class SetModel < Base
    def call
      session["model"] = params["model"]
      partial("fragments/settings/set_model", locals:)
    end

    private

    def locals
      {models: cache.models, current_model: session["model"]}
    end
  end
end
