class OverworldEvent {
  constructor({ map, event }) {
    this.map = map
    this.event = event
  }

  textMessage(resolve) {
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init(document.querySelector('.game-container'))
  }

  inputTextMessage(resolve) {
    const message = new InputTextMessage({
      text: this.event.text,
      answer: this.event.answer,
      answerText: this.event.answerText,
      img: this.event.img,
      width: this.event.width,
      onComplete: (solved) => resolve(solved ? "SOLVED" : "UNSOLVED")
    })
    message.init(document.querySelector('.game-container'))
  }

  messageBox(resolve) {
    const box = new MessageBox({
      text: this.event.text,
      img: this.event.img,
      onComplete: () => resolve(),
      width: this.event.width || null
    })
    box.init(document.querySelector('.game-container'))
  }

  changeMap(resolve) {
    const sceneTransition = new SceneTransition()

    sceneTransition.init(document.querySelector('.game-container'), () => {
      this.map.overworld.startMap(window.OverworldMaps[this.event.map])
      resolve()

      sceneTransition.fadeOut()
    })
  }

  pause(resolve) {
    this.map.isPaused = true
    const menu = new ClueMenu({
      progress: this.map.overworld.progress,
      content: this.event.content,
      isFinal: this.event.isFinal || false,
      onComplete: async () => {
        resolve()
        await utils.wait(200)
        this.map.isPaused = false
        // this.map.overworld.startGameLoop()
      }
    })
    menu.init(document.querySelector('.game-container'))
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true
    this.map.overworld.progress.save()
    resolve()
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}