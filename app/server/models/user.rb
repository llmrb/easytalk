# frozen_string_literal: true

module Server
  module Models
    class User < Base
      self.table_name = "users"

      has_secure_password
    end
  end
end
