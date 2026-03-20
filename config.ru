# frozen_string_literal: true

require_relative "app/server/init"

map "/sidekiq" do
  run Sidekiq::Web
end

use Rack::Static, urls: ["/g", "/images", "/stylesheets", "/vendor"], root: "public"
run Server::Router
