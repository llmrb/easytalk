# frozen_string_literal: true

class Server::Router < Roda
  plugin :common_logger
  plugin :partials,
    escape: true,
    layout: "layout",
    views: File.expand_path("views", __dir__)

  include Server::Routes

  def page_view(name, current_path:, title:)
    view(
      name,
      layout_opts: {
        locals: {
          title:
        }
      }
    )
  end

  route do |r|
    r.on "api" do
      r.is "models" do
        r.get do
          ListModels.new(self).call
        end
      end

      r.is "tools" do
        r.get do
          ListTools.new(self).call
        end
      end

      r.is "ws" do
        throw :halt, Websocket.new(self).call
      end
    end

    r.root do
      response['content-type'] = "text/html; charset=utf-8"
      page_view("chat", current_path: "/", title: "Relay")
    end

    r.get true do
      r.redirect "/"
    end
  end
end
