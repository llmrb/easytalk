# frozen_string_literal: true

class Relay::Router < Roda
  ##
  # Plugins
  plugin :common_logger

  plugin :sessions,
    key: 'relay.session',
    secret: ENV["SESSION_SECRET"]

  plugin :partials,
    escape: true,
    layout: "layout",
    views: File.expand_path("../views", __dir__)

  ##
  # Routes
  route do |r|
    r.root do
      ChatPage.new(self).call
    end

    r.get true do
      r.redirect "/"
    end

    r.on "settings" do
      r.is "set-model" do
        Settings::SetModel.new(self).call
      end

      r.is "set-provider" do
        Settings::SetProvider.new(self).call
      end
    end

    r.on "api" do
      r.is "ws" do
        throw :halt, Websocket.new(self).call
      end
    end

    r.is "models" do
      r.get do
        ListModels.new(self).call
      end
    end

    r.is "providers" do
      r.get do
        ListProviders.new(self).call
      end
    end

    r.is "tools" do
      r.get do
        ListTools.new(self).call
      end
    end
  end

  private

  module Helper
    def page(name, **locals)
      view(File.join("pages", name), layout_opts: {locals:})
    end
  end

  include Relay::Routes
  include Helper
end
