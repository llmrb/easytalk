## About

RealTalk is a small chat app built with [llm.rb](https://github.com/llmrb/llm.rb).
It demonstrates streaming over WebSockets, tool calls, image generation,
provider switching, and model selection with a small React client and a
simple Rack backend. See the [Screencast](#screencast) for a demo.

Enjoy :)

## Screencast

[![Watch the screencast](https://img.youtube.com/vi/fOvAFq7ITiE/maxresdefault.jpg)](https://youtu.be/fOvAFq7ITiE)

Watch the screencast on [YouTube](https://youtu.be/fOvAFq7ITiE).

## Features

- ⚙️ Rack application built with Falcon and async-websocket
- 🌊 Streaming chat over WebSockets
- 🔀 Switch providers: OpenAI, Gemini, Anthropic, xAI and DeepSeek
- 🧠 Switch models: varies by provider
- 🛠️ Add your own tools: see [app/server/tools/](app/server/tools)
- 🖼️ Image generation via [create_image.rb](./app/server/tools/create_image.rb) - requires Gemini, OpenAI or xAI but works with any provider

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

**Database**

Create a migration:

```sh
bundle exec rake db:new_migration name=create_widgets
```

Run migrations:

```sh
bundle exec rake db:migrate
```

Models live in `app/server/models`, and the app boots Active Record from
`db/config.yml`.

The SQLite database files under `db/` are local-only and ignored by git.

**Development**

Run the server and webpack dev server in separate shells:

```sh
bundle exec rake dev:server
bundle exec rake dev:client
```

Then open `http://localhost:9293`. The Ruby server on `9292` only
serves `/models` and `/ws`.

Or run both processes together with Foreman:

```sh
bundle exec foreman start
```

## Sources

* [GitHub.com](https://github.com/llmrb/realtalk)
* [GitLab.com](https://gitlab.com/llmrb/realtalk)
* [Codeberg.org](https://codeberg.org/llmrb/realtalk)

## License

[BSD Zero Clause](https://choosealicense.com/licenses/0bsd/)
<br>
See [LICENSE](./LICENSE)
