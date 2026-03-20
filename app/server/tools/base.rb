module Server::Tools
  class Base < LLM::Tool
    ##
    # Returns the root directory of the project
    # @return [String]
    def root
      File.realpath File.join(__dir__, "..", "..", "..")
    end
  end
end
