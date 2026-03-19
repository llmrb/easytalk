# frozen_string_literal: true

require "standalone_migrations"
StandaloneMigrations::Tasks.load_tasks
dir = File.join(__dir__, "app", "client")

desc "Build the client"
task build: %i[npm:build]

namespace :dev do
  desc "Serve the server without rebuilding client assets"
  task :server do
    sh "env $(cat .env) " \
       "bundle exec falcon serve --bind http://0.0.0.0:9292"
  end

  desc "Run webpack-dev-server for the client"
  task client: %i[npm:i] do
    Dir.chdir(dir) do
      sh "npm run dev"
    end
  end
end

namespace :npm do
  desc "Build the client"
  task build: %i[npm:i] do
    Dir.chdir(dir) do
      sh "npx webpack build"
    end
  end

  desc "Run 'npm install'"
  task :i do
    Dir.chdir(dir) do
      sh "npm i"
    end
  end
end
