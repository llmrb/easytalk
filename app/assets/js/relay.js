import "../css/application.css"
import htmx from "htmx.org"
import hljs from "highlight.js"
import { marked } from "marked"

window.htmx = htmx
window.marked = marked
require("htmx-ext-ws")

import { Jukebox } from "../js/jukebox"
import { Timer } from "../js/jukebox/timer"

;(function() {
  document.addEventListener("DOMContentLoaded", () => {
    const jukebox = Jukebox()
    const timer = Timer(document.getElementById("chatbot-status"))
    const stream = document.getElementById("chatbot-stream")
    let shouldFollow = true

    const isNearBottom = (el, threshold = 48) =>
      !el || el.scrollHeight - el.scrollTop - el.clientHeight <= threshold

    const scroll = () => {
      if (!stream || !shouldFollow) return
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

    if (stream) {
      shouldFollow = isNearBottom(stream)
      stream.addEventListener("scroll", () => {
        shouldFollow = isNearBottom(stream)
      }, { passive: true })
    }

    document.body.addEventListener("htmx:oobAfterSwap", (event) => {
      if (event.target.id === "chatbot-status") {
        timer.parentEl = event.target
        timer.handle(event.target)
      }
      markdown(event.target)
      follow()
    })

    document.body.addEventListener("htmx:afterSwap", (event) => {
      markdown(event.target)
    })

    markdown()
    follow()
  })
})()
