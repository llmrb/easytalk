import "../css/application.css"
import htmx from "htmx.org"
import hljs from "highlight.js"
import { marked } from "marked"

window.htmx = htmx
window.marked = marked
require("htmx-ext-ws")

import { Jukebox } from "../js/jukebox"

;(function() {
  document.addEventListener("DOMContentLoaded", () => {
    const jukebox = Jukebox()
    const scroll = () => {
      const stream = document.getElementById("chatbot-stream")
      if (!stream) return
      stream.scrollTop = stream.scrollHeight
    }

    const follow = () => {
      scroll()
      requestAnimationFrame(scroll)
      setTimeout(scroll, 0)
      setTimeout(scroll, 32)
    }

    const syntaxHighlight = (el) =>{
      hljs.highlightElement(el)
    }

    const modifyAnchors = (el) =>{
      el.setAttribute("target", "_blank")
      el.setAttribute("rel", "noreferrer noopener")
    }

    const markdown = (root = document.body) => {
      const nodes = root.querySelectorAll("[data-markdown]")
      nodes.forEach((node, index) => {
        node.innerHTML = marked.parse(node.dataset.markdownSource || "")
        node.querySelectorAll("pre code").forEach(syntaxHighlight)
        node.querySelectorAll("a").forEach(modifyAnchors)
        if (index === nodes.length - 1)
          jukebox.scanForMusic(node)
      })
    }

    // Timer functionality similar to jukebox player pattern
    const Timer = function() {
      const self = Object.create(null)
      let interval = null
      let startTime = null
      let currentStatus = ""

      const updateDisplay = (text) => {
        const statusElement = document.getElementById("chatbot-status")
        if (!statusElement) return
        
        const statusSpan = statusElement.querySelector(".font-medium.text-zinc-100")
        if (statusSpan) {
          statusSpan.textContent = text
        }
      }

      self.start = (statusText) => {
        if (interval) {
          clearInterval(interval)
        }
        
        currentStatus = statusText.replace(/\s*\(\d+s\)$/, "")
        startTime = Date.now()
        
        interval = setInterval(() => {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
          updateDisplay(`${currentStatus} (${elapsedSeconds}s)`)
        }, 1000)
        
        updateDisplay(`${currentStatus} (0s)`)
      }

      self.stop = () => {
        if (interval) {
          clearInterval(interval)
          interval = null
        }
        startTime = null
        currentStatus = ""
      }

      self.handleStatusUpdate = (statusElement) => {
        const statusSpan = statusElement.querySelector(".font-medium.text-zinc-100")
        if (!statusSpan) return
        
        const statusText = statusSpan.textContent.trim()
        
        if (statusText.startsWith("Thinking") || statusText.startsWith("Running")) {
          self.start(statusText)
        } else {
          self.stop()
        }
      }

      return self
    }

    const timer = Timer()

    // Handle status updates from HTMX
    document.body.addEventListener("htmx:oobAfterSwap", (event) => {
      if (event.target.id === "chatbot-status") {
        timer.handleStatusUpdate(event.target)
      }
    })

    markdown()
    follow()

    document.body.addEventListener("htmx:afterSwap", (event) => markdown(event.target))
    document.body.addEventListener("htmx:oobAfterSwap", (event) => {
      markdown(event.target)
      follow()
    })
  })
})()