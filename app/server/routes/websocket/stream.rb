# frozen_string_literal: true

class Server::Routes::Websocket
  class Stream
    def initialize(conn, sock)
      @conn = conn
      @sock = sock
    end

    def <<(chunk)
      @sock.stream(@conn, chunk.to_s)
    end
  end
end
