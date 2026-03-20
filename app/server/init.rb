# frozen_string_literal: true

module Server
  require "bundler/setup"
  Bundler.require(:default)

  require "erb"
  require "yaml"

  require_relative "../../db/config"
  DB.establish_connection!(env: ENV["RACK_ENV"] || "development")

  loader = Zeitwerk::Loader.new
  loader.ignore(
    File.join(__dir__, "init.rb"),
    File.join(__dir__, "sidekiq.rb")
  )
  loader.push_dir(__dir__, namespace: self)
  loader.setup

  require_relative "sidekiq"

  ##
  # Returns the path to the public/ directory
  # @return [String]
  def self.public_dir
    @public_dir ||= File.realpath File.join(__dir__, "..", "..", "public")
  end
end
