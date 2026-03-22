# frozen_string_literal: true

module Relay
  require_relative "relay/cache"
  require_relative "relay/task_monitor"
  require_relative "relay/task"

  ##
  # Returns an object that can be used to store application state
  # that should persist between requests.
  # @return [Relay::InMemoryCache]
  def self.cache
    @cache
  end
  @cache = Cache::InMemoryCache.new

  ##
  # Returns the root path of the application
  # @return [String]
  def self.root
    @root ||= File.realpath File.join(__dir__, "..")
  end

  ##
  # Returns the path to the public/ directory
  # @return [String]
  def self.public_dir
    @public_dir ||= File.realpath File.join(root, "public")
  end

  ##
  # Returns the path to the app/assets/ directory
  # @return [String]
  def self.assets_dir
    @assets_dir ||= File.realpath File.join(root, "app", "assets")
  end
end
