## About

RealTalk is a small chat app built with [llm.rb](https://github.com/llmrb/llm.rb).
It demonstrates streaming over WebSockets, tool calls, provider switching, and
model selection in a simple Rack app with a small React frontend. See the
[Screencast](#screencast) for a demo. For the story behind the name, check out
[2Pac – Real Talk](https://www.youtube.com/watch?v=_3LuY9isL_Y).

Enjoy :)

## Screencast

[![Watch the screencast](https://img.youtube.com/vi/R3fw4i3uOlQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=R3fw4i3uOlQ)

Watch the screencast on [YouTube](https://www.youtube.com/watch?v=R3fw4i3uOlQ).

## Features

- ⚙️ Rack application built with Falcon and async-websocket
- 🌊 Streaming chat over WebSockets
- 🔀 Switch providers: OpenAI, Gemini, Anthropic, xAI and DeepSeek
- 🧠 Switch models: varies by provider
- 🛠️ Add your own tools: see [app/tools/](app/tools)
- 🖼️ Image generation via [create_image.rb](./app/tools/create_image.rb) - requires Gemini, OpenAI or xAI but works with any provider

## Usage

**Secrets**

Set your secrets in `.env`:

```sh
OPENAI_SECRET=...
GEMINI_SECRET=...
ANTHROPIC_SECRET=...
DEEPSEEK_SECRET=...
XAI_SECRET=...
```

**Packages**

Install Ruby gems:

```sh
bundle install
```

Build the frontend:

```sh
bundle exec rake build
```

**Serve**

Start the server:

```sh
bundle exec rake serve
```

## Sources

* [GitHub.com](https://github.com/llmrb/realtalk)
* [GitLab.com](https://gitlab.com/llmrb/realtalk)
* [Codeberg.org](https://codeberg.org/llmrb/realtalk)

## License

[BSD Zero Clause](https://choosealicense.com/licenses/0bsd/)
<br>
See [LICENSE](./LICENSE)
