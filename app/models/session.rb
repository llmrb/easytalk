# frozen_string_literal: true

module Relay::Models
  class Session < Sequel::Model
    set_dataset :sessions
    
    plugin :timestamps, create: :created_at, update: :updated_at

    many_to_one :user

    ##
    # Serializes an LLM::Session object to JSON and stores it in session_data
    # @param [LLM::Session] llm_session
    def llm_session=(llm_session)
      self.session_data = llm_session.to_json
      # Update token counts from the session if available
      update_tokens_from(llm_session) if llm_session.respond_to?(:input_tokens)
    end

    ##
    # Deserializes an LLM::Session object from stored JSON
    # @param [LLM::Provider] llm_provider
    # @return [LLM::Session]
    def to_llm_session(llm_provider)
      # Handle both JSON string and already-parsed JSON objects
      json_string = if session_data.is_a?(String)
        session_data
      else
        session_data.to_json
      end
      LLM::Session.new(llm_provider).restore(string: json_string)
    end

    ##
    # Updates token counts from an LLM::Response or LLM::Session
    # @param [LLM::Response, LLM::Session] source
    def update_tokens_from(source)
      if source.is_a?(LLM::Response)
        self.input_tokens = source.input_tokens.to_i
        self.output_tokens = source.output_tokens.to_i
        self.total_tokens = source.total_tokens.to_i
      elsif source.is_a?(LLM::Session)
        self.input_tokens = source.input_tokens.to_i
        self.output_tokens = source.output_tokens.to_i
        self.total_tokens = source.total_tokens.to_i
      end
    end

    ##
    # Returns estimated cost for this session based on token counts
    # @return [Float, nil] estimated cost in dollars, or nil if cost can't be estimated
    def estimated_cost
      # This would need access to the provider's pricing information
      # For now, return nil - can be implemented later with LLM::Registry
      nil
    end

    ##
    # Returns a user-friendly display name for the session
    # @return [String]
    def display_name
      "#{model} (#{provider}) - #{created_at.strftime('%Y-%m-%d %H:%M')}"
    end
  end
end