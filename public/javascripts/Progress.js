class Progress {
  constructor() {
    this.mapId = "thirdScene"
    this.saveFileKey = "EscapeRooms_SaveFile1"
  }

  save() {
    window.localStorage.setItem(this.saveFileKey, JSON.stringify({
      mapId: this.mapId,
      playerState: {
        storyFlags: playerState.storyFlags
      }
    }))
  }

  getSaveFile() {
    const file = window.localStorage.getItem(this.saveFileKey)
    return file ? JSON.parse(file) : null
  }
  
  load() {
    const file = this.getSaveFile()
    if (file) {
      this.mapId = file.mapId
      Object.keys(file.playerState).forEach(key => {
        playerState[key] = file.playerState[key]
      })
    }
  }
}