# frozen_string_literal: true

module Relay::Tools
  class CreateImage < Base
    name "create-image"
    description "Generates one or more images from a prompt and returns embeddable HTML"
    param :prompt, String, "The prompt", required: true
    param :provider, Enum["openai", "google", "xai"], "The provider", default: "xai"
    param :n, Integer, "The number of images to generate", default: 1

    ##
    # Returns a HTML link for an image
    # @return [Array<Hash>]
    def call(prompt:, provider: "xai", n: 1)
      key  = ENV["#{provider.upcase}_SECRET"]
      llm  = LLM.method(provider).call(key:)
      res  = llm.images.create(prompt:, n:)
      res.images.map do |image|
        file = "#{SecureRandom.hex}.png"
        IO.copy_stream image, File.join(images_dir, file)
        { directions: 'embed the html in your response exactly as it appears', html: "<img src='/g/#{file}'>" }
      end
    rescue LLM::RateLimitError => ex
      { error: ex.class.to_s, message: "rate limit reached" }
    rescue => ex
      { error: ex.class.to_s, message: ex.message }
    end

    private

    ##
    # Returns the directory where images are stored
    # @return [String]
    def images_dir
      File.join(root, "public", "g")
    end
  end
end
