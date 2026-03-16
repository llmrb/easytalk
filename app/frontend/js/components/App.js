import React, {useEffect, useLayoutEffect, useRef, useState} from "react"
import {marked} from "marked"
import ModelSelect from "~/js/components/ModelSelect"
import ProviderSelect from "~/js/components/ProviderSelect"
import useModels from "~/js/hooks/useModels"

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
const origin = window.location.origin

const stripImages = (markdown) => {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, (_match, alt) => {
      return `\n\n> [image${alt ? `: ${alt}` : ""} loading]\n\n`
    })
    .replace(/<img\b[^>]*alt=(['"])(.*?)\1[^>]*>/gi, (_match, _quote, alt) => {
      return `\n\n> [image${alt ? `: ${alt}` : ""} loading]\n\n`
    })
    .replace(/<img\b[^>]*>/gi, "\n\n> [image loading]\n\n")
}

const render = (markdown, {images = true} = {}) => {
  const content = images ? markdown : stripImages(markdown)
  return marked.parse(content.replaceAll("sandbox:/", `${origin}/`))
}

const AssistantMessage = React.memo(function AssistantMessage({markdown}) {
  return (
    <div className="mt-3 flex first:mt-0">
      <div
        className="max-w-[85%] rounded-3xl rounded-bl-lg bg-white px-4 py-3 text-zinc-900 shadow-sm ring-1 ring-zinc-200"
        dangerouslySetInnerHTML={{
          __html: `<div class="assistant-content max-w-none whitespace-normal [&_p]:my-0 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-zinc-100 [&_pre]:p-3 [&_code]:font-mono [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-600 [&_img]:mt-2 [&_img]:h-auto [&_img]:max-h-[32rem] [&_img]:w-full [&_img]:max-w-2xl [&_img]:rounded-2xl [&_img]:object-contain">${render(markdown)}</div>`
        }}
      />
    </div>
  )
})

export default function App() {
  const [status, setStatus] = useState("connecting")
  const [message, setMessage] = useState("")
  const [entries, setEntries] = useState([])
  const [streaming, setStreaming] = useState("")
  const [provider, setProvider] = useState("openai")
  const {error: modelsError, loading: modelsLoading, model, models, setModel} = useModels(provider)
  const socketRef = useRef(null)
  const streamRef = useRef(null)

  const say = (text) => {
    setEntries((prev) => [...prev, {kind: "system", text}])
  }

  const tell = (text) => {
    setEntries((prev) => [...prev, {kind: "user", text}])
  }

  const scrollToBottom = () => {
    const stream = streamRef.current
    if (stream) {
      stream.scrollTop = stream.scrollHeight
    }
  }

  useEffect(() => {
    if (modelsLoading) {
      setStatus("loading models")
    } else if (modelsError) {
      setStatus("model error")
      say("client: failed to load models")
    } else if (models.length > 0 && status === "loading models") {
      setStatus("ready")
    }
  }, [models.length, modelsError, modelsLoading, status])

  useEffect(() => {
    if (!model) {
      return
    }
    const socket = new WebSocket(
      `${protocol}//${window.location.host}/ws?provider=${encodeURIComponent(provider)}&model=${encodeURIComponent(model)}`
    )
    socketRef.current = socket
    setStatus("connecting")

    const stream = (chunk) => {
      setStreaming((prev) => prev + chunk)
    }

    const finish = () => {
      setStreaming((current) => {
        if (current) {
          setEntries((prev) => [...prev, {kind: "assistant", markdown: current}])
        }
        return ""
      })
    }

    socket.addEventListener("open", () => {
      setStatus("ready")
    })

    socket.addEventListener("close", () => {
      setStatus("closed")
    })

    socket.addEventListener("error", () => {
      setStatus("error")
      say("client: socket error")
    })

    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data)
        switch (payload.event) {
          case "welcome":
            say(`server: connected (${payload.provider || provider}${payload.model ? ` / ${payload.model}` : ""})`)
            break
          case "status":
            setStatus(payload.message)
            break
          case "delta":
            stream(payload.message)
            break
          case "done":
            finish()
            setStatus("ready")
            break
          case "error":
            setStreaming("")
            setStatus("error")
            say("server: server error")
            break
          default:
            break
        }
      } catch {
        say("client: recv failed")
      }
    })

    return () => socket.close()
  }, [provider, model])

  useLayoutEffect(() => {
    scrollToBottom()
  }, [entries, streaming])

  useEffect(() => {
    const stream = streamRef.current
    if (!stream) {
      return
    }

    const onLoad = (event) => {
      if (event.target instanceof HTMLImageElement) {
        scrollToBottom()
      }
    }

    stream.addEventListener("load", onLoad, true)
    return () => stream.removeEventListener("load", onLoad, true)
  }, [])

  const onSubmit = (event) => {
    event.preventDefault()
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      say("client: socket is not open")
      return
    }
    if (!message) {
      return
    }
    setStatus("waiting")
    tell(message)
    socket.send(message)
    setMessage("")
  }

  const onProviderChange = (event) => {
    setProvider(event.target.value)
  }

  return (
    <main className="h-screen bg-white font-sans text-zinc-900">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6">
        <header className="border-b border-zinc-100 pb-3 text-center">
          <p className="text-sm font-medium tracking-[0.18em] text-zinc-400 uppercase">
            easytalk
          </p>
        </header>
        <div
          id="stream"
          ref={streamRef}
          className="min-h-0 flex-1 overflow-y-auto rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-[15px] leading-7 shadow-sm"
        >
          {entries.map((entry, index) => {
            if (entry.kind === "assistant") {
              return <AssistantMessage key={index} markdown={entry.markdown} />
            }

            if (entry.kind === "user") {
              return (
                <div key={index} className="mt-3 flex justify-end first:mt-0">
                  <div className="max-w-[75%] rounded-3xl rounded-br-lg bg-zinc-900 px-4 py-3 text-white shadow-sm">
                    {entry.text}
                  </div>
                </div>
              )
            }

            return (
              <div key={index} className="mt-3 text-center text-xs text-zinc-500 first:mt-0">
                {entry.text}
              </div>
            )
          })}
          {streaming ? (
            <div className="mt-3 flex">
              <div
                className="max-w-[85%] rounded-3xl rounded-bl-lg bg-white px-4 py-3 text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                dangerouslySetInnerHTML={{
                  __html: `<div class="assistant-content max-w-none whitespace-normal [&_p]:my-0 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-zinc-100 [&_pre]:p-3 [&_code]:font-mono [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-600">${render(streaming, {images: false})}</div>`
                }}
              />
            </div>
          ) : null}
        </div>
        <p className="text-center text-sm text-zinc-500">
          Status: <span className="font-semibold text-zinc-700">{status}</span>
        </p>
        <div className="flex justify-center text-sm">
          <div className="flex items-center gap-3 text-zinc-500">
            <ProviderSelect provider={provider} onChange={onProviderChange} />
            <ModelSelect
              loading={modelsLoading}
              model={model}
              models={models}
              onChange={(event) => setModel(event.target.value)}
            />
            <span className="text-xs text-zinc-400">
              {modelsLoading ? "..." : `${models.length} models`}
            </span>
          </div>
        </div>
        <form
          className="sticky bottom-0 flex flex-col gap-2 bg-gradient-to-b from-white/0 via-white/90 to-white pt-3 pb-1"
          onSubmit={onSubmit}
        >
          <input
            className="h-13 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10"
            type="text"
            placeholder="Type a message"
            autoComplete="off"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="min-w-24 rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/10 focus:outline-none"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
