# frozen_string_literal: true

module Relay
  require "bundler/setup"
  Bundler.require(:default)

  require "erb"
  require "yaml"

  loader = Zeitwerk::Loader.new
  loader.ignore(
    File.join(__dir__, "init.rb"),
    File.join(__dir__, "init")
  )
  loader.push_dir(__dir__, namespace: self)
  loader.setup

  require_relative "../lib/relay"
  require_relative "init/env"
  require_relative "init/database"
  require_relative "init/sidekiq"
  require_relative "init/router"
  require_relative "init/tools"

  FileUtils.mkdir_p File.join(Relay.public_dir, "g")
end
