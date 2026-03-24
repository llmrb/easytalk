const Player = function (parentEl) {
  if (!parentEl)
    return null

  const self = Object.create(null)
  const titleEl = parentEl.querySelector(".jukebox-title")
  const bodyEl = parentEl.querySelector(".jukebox-body")
  const iframeEl = bodyEl?.querySelector("iframe")

  self.parentEl = parentEl
  self.iframeEl = iframeEl

  self.show = () => {
    parentEl.classList.remove("hidden")
  }

  self.getSrc = () => {
    return iframeEl?.getAttribute("src")
  }

  self.getTitle = () => {
    return titleEl.textContent
  }

  self.setTitle = (title) => {
    if (!title) return
    titleEl.textContent = title
  }

  self.setTrack = (artist) => {
    if (!artist.track) return
    iframeEl.src = artist.track
    iframeEl.dataset.id = artist.track
  }

  self.setArtist = (artist) => {
    if (!artist.name || !artist.title) return
    self.setTitle(`${artist.name} - ${artist.title}`)
    self.setTrack(artist)
  }

  self.replaceWith = (otherPlayer) => {
    self.setTitle(otherPlayer.getTitle())
    bodyEl.replaceChildren(otherPlayer.iframeEl)
  }

  return self
}

Player.template = function() {
  const raw = document.getElementById("tmpl-jukebox-player").content
  const tmpl = raw.firstElementChild.cloneNode(true)
  return tmpl
}

export {Player}
