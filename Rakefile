# frozen_string_literal: true

desc "Build the frontend"
task :build do
  Dir.chdir File.join(__dir__, "app", "frontend") do
    sh "npx webpack build"
  end
end

desc "Serve the website"
task serve: [:build] do
  sh "env $(cat .env) " \
     "bundle exec falcon serve --bind http://0.0.0.0:9292"
end
