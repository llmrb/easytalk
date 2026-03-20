# frozen_string_literal: true

class Server::Router < Roda
  include Server::Routes

  route do |r|
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

    r.get do
      response.status = 200
      response['content-type'] = "text/plain"
      "Relay v0.1.0\nPowered by Ruby"
    end
  end
end
