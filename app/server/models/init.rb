# frozen_string_literal: true

module Server
  module Models
    require_relative "base"
    Dir[File.join(__dir__, "*.rb")].sort.each { require(_1) }
  end
end
