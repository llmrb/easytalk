# frozen_string_literal: true

require "bundler/setup"
Bundler.require(:default)

Dir[File.join(__dir__, "app", "controllers", "*.rb")].sort.each { require(_1) }
Dir[File.join(__dir__, "app", "tools", "*.rb")].sort.each { require(_1) }

files     = Rack::Files.new(File.expand_path("public", __dir__))
openai    = LLM.openai(key: ENV["OPENAI_SECRET"])
gemini    = LLM.gemini(key: ENV["GEMINI_SECRET"])
anthropic = LLM.anthropic(key: ENV["ANTHROPIC_SECRET"])
deepseek  = LLM.deepseek(key: ENV["DEEPSEEK_SECRET"])
xai       = LLM.xai(key: ENV["XAI_SECRET"])
llms      = {
  "openai" => openai,
  "gemini" => gemini,
  "anthropic" => anthropic,
  "deepseek" => deepseek,
  "xai" => xai
}

run lambda { |env|
  case env["PATH_INFO"]
  when "/models" then Controller::Models.new(env, llms).call
  when "/ws" then Controller::Websocket.new(env, llms).call
  when "/" then files.call(env.merge("PATH_INFO" => "/index.html"))
  else files.call(env)
  end
}
