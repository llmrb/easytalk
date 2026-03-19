# frozen_string_literal: true

module Server
  module Models
    class Base < ActiveRecord::Base
      self.abstract_class = true
    end
  end
end
