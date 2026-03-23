export const Dock = () => {
  const self = { activeJukeboxId: null }

  const notice = (title) => {
    const notice = document.createElement("p")
    notice.className = "my-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700"
    notice.textContent = `${title} is playing in the media dock.`
    return notice
  }

  const play = (jukebox, activeJukebox) => {
    self.activeJukeboxId = jukebox.jukeBoxId
    jukebox.parentEl.classList.remove("hidden")
    activeJukebox.bodyEl.replaceChildren(jukebox.parentEl)
  }

  const getTemplate = () => {
    const rawTmpl = document.getElementById("tmpl-jukebox-player").content
    const tmpl = rawTmpl.firstElementChild.cloneNode(true)
    const iframe  = tmpl.querySelector("iframe")
    return {tmpl, iframe}
  }

  const getArtist = (node) =>{
    const artistEl = node.querySelector(".artist")
    if (artistEl) {
      const attrs = Array.from(artistEl.querySelectorAll("[data-name]"))
      const entries = attrs.map((el) => [el.dataset.name, el.textContent.trim()])
      return {artistEl, artist: Object.fromEntries(entries)}
    } else {
      return {}
    }
  }

  const getActiveJukebox = () => {
    const parentEl = document.querySelector("#jukebox")
    const titleEl = parentEl.querySelector("#jukebox-title")
    const bodyEl = parentEl.querySelector("#jukebox-body")
    const iframe = bodyEl.querySelector("iframe")
    const src = iframe?.getAttribute("src")
    return {parentEl, titleEl, bodyEl, iframe, src}
  }

  const Jukebox = (node) => {
    const {tmpl, iframe} = getTemplate()
    const {artist, artistEl} = getArtist(node)
    const title = "Jukebox"
    if (!artist) return
    tmpl.dataset.title = title
    tmpl.querySelector(".title").textContent = `${artist.name} - ${artist.title}`
    iframe.src = artist.track
    iframe.dataset.id = artist.track
    return {
      parentEl: tmpl,
      titleEl: tmpl.querySelector(".title"),
      bodyEl: tmpl.querySelector(".aspect-video"),
      artistEl, iframe, jukeBoxId: artist.track, title
    }
  }

  self.scan = (node) => {
    const newJukebox = Jukebox(node)
    if (!newJukebox) return
    const activeJukebox = getActiveJukebox()
    const { jukeBoxId, title, artistEl, iframe } = newJukebox
    activeJukebox.titleEl.textContent = title || "Now Playing"
    artistEl.replaceWith(notice(activeJukebox.titleEl.textContent))
    if (self.activeJukeboxId === jukeBoxId) return
    if (iframe.getAttribute("src") === activeJukebox.src) return
    play(newJukebox, activeJukebox)
  }

  return self
}
