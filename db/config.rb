# frozen_string_literal: true

module DB
  module_function

  ##
  # Establishes a connection to the database
  def establish_connection!(env:)
    erb = ERB.new(File.read(File.join(__dir__, "config.yml")))
    config = YAML.safe_load(erb.result, aliases: true)
    ActiveRecord::Base.establish_connection(config[env])
  end
end
