# frozen_string_literal: true

module Relay::Routes
  class ChatPage < Base
    def call
      set_content_type
      set_session
      page("chat", title: "Relay")
    end

    private

    def set_content_type
      response["content-type"] = "text/html"
    end

    def set_session
      session["provider"] ||= "deepseek"
      session["model"] ||= "deepseek-chat"
    end
  end
end

