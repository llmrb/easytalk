# frozen_string_literal: true

env = File.join Relay.root, ".env"
if File.readable?(env)
  data = File.read(env)
  lines = data.each_line
  lines.each do |line|
    k, v = line.split("=")
    ENV[k] = v.chomp
  end
end
