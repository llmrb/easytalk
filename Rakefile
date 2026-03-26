# frozen_string_literal: true

require_relative "app/init"



load "tasks/rubocop.rake"
load "tasks/assets.rake"
load "tasks/db.rake"
load "tasks/dev.rake"

task :test do
  require "test/unit"
  require "test/unit/ui/console/testrunner"
  
  test_files = Dir["test/**/*_test.rb"]
  if test_files.empty?
    puts "No tests found. Run `rake test:create` to create a test structure."
  else
    test_files.each { |file| require File.expand_path(file) }
  end
end

namespace :test do
  desc "Create test directory structure"
  task :create do
    FileUtils.mkdir_p("test")
    FileUtils.mkdir_p("test/helpers")
    
    # Create test helper
    unless File.exist?("test/test_helper.rb")
      File.write("test/test_helper.rb", <<~RUBY)
        # frozen_string_literal: true

        require "test/unit"
        require "rack/test"
        require_relative "../app/init"

        ENV["RACK_ENV"] = "test"

        class TestHelper < Test::Unit::TestCase
          include Rack::Test::Methods

          def app
            Relay::Router.freeze.app
          end
        end
      RUBY
    end
    
    puts "Test directory structure created."
    puts "Add your test files to test/ directory with _test.rb suffix."
  end
end