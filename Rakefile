# frozen_string_literal: true

require "standalone_migrations"
StandaloneMigrations::Tasks.load_tasks

client_dir = File.join(__dir__, "app", "client")

desc "Build the app"
task build: %i[assets:build]

namespace :dev do
  desc "Serve the server"
  task :server do
    sh "env $(cat .env) " \
       "bundle exec falcon serve --bind http://0.0.0.0:9292"
  end

  desc "Run Sidekiq"
  task :sidekiq do
    sh "env $(cat .env) " \
       "bundle exec sidekiq -C app/server/config/sidekiq.yml -r ./app/server/init.rb"
  end

  desc "Watch Tailwind CSS"
  task :css do
    sh "npm run css:watch"
  end
end

namespace :css do
  desc "Build Tailwind CSS"
  task :build do
    sh "npm run css:build"
  end
end

namespace :assets do
  desc "Build frontend assets"
  task build: %i[css:build js:vendor]
end

namespace :js do
  desc "Copy vendor JavaScript assets"
  task :vendor do
    mkdir_p File.join(__dir__, "public", "vendor")
    cp File.join(__dir__, "node_modules", "htmx.org", "dist", "htmx.min.js"),
      File.join(__dir__, "public", "vendor", "htmx.min.js")
    cp File.join(__dir__, "node_modules", "htmx-ext-ws", "ws.js"),
      File.join(__dir__, "public", "vendor", "htmx-ext-ws.js")
  end
end
