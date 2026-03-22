# frozen_string_literal: true

module Relay::Routes
  class Base
    ##
    # @param [Hash] env
    #  The Rack env
    # @return [Relay::Routes::Base]
    def initialize(roda)
      @roda = roda
    end

    ##
    # @return [String]
    #  The requested provider, defaulting to deepseek
    def provider
      session["provider"] || "deepseek"
    end

    ##
    # @return [String,nil]
    #  The requested model
    def model
      session["model"] || params["model"]
    end

    ##
    # @return [LLM::Provider]
    #  The selected provider object
    def llm
      llms[provider] || llms["openai"]
    end

    ##
    # @return [String]
    #  Returns the root path
    def root
      @root ||= File.join __dir__, "..", ".."
    end

    ##
    # Returns a Hash or Hash-like object of request parameters
    # @return [Hash]
    def params
      request.params
    end

    ##
    # @return [Hash<String,LLM::Provider>]
    #  A hashmap of initialized LLM::Provider objects
    def llms
      @llms ||= {
        "openai" => LLM.openai(key: ENV["OPENAI_SECRET"]),
        "google" => LLM.google(key: ENV["GOOGLE_SECRET"]),
        "anthropic" => LLM.anthropic(key: ENV["ANTHROPIC_SECRET"]),
        "deepseek" => LLM.deepseek(key: ENV["DEEPSEEK_SECRET"]),
        "xai" => LLM.xai(key: ENV["XAI_SECRET"])
      }.transform_values(&:persist!)
    end

    ##
    # @return [Relay::InMemoryCache]
    def cache
      Relay.cache
    end

    ##
    # Delegate missing methods to the Roda instance
    def method_missing(name, *args, **kwargs, &block)
      if @roda.respond_to?(name)
        @roda.send(name, *args, **kwargs, &block)
      else
        super
      end
    end
  end
end
