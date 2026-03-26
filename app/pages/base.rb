# frozen_string_literal: true

module Relay::Pages
  ##
  # Base class for full-page renderers.
  class Base
    ##
    # @param [Roda] roda
    # @return [Relay::Pages::Base]
    def initialize(roda)
      @roda = roda
    end

    private

    ##
    # Renders a page template with the shared layout.
    # @param [String] name
    # @param [Hash] locals
    # @return [String]
    def page(name, **locals)
      view(File.join("pages", name), layout_opts: {locals:})
    end

    ##
    # @return [Roda::RodaRequest]
    #  Alias the request object as `r` to match Roda route blocks.
    def r
      @roda.request
    end

    ##
    # Delegate missing methods to the current Roda instance.
    def method_missing(name, *args, **kwargs, &block)
      if @roda.respond_to?(name)
        @roda.send(name, *args, **kwargs, &block)
      else
        super
      end
    end
  end
end
