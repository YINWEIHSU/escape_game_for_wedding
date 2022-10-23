class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.canvas.width = 640
    this.canvas.height = 320
    this.ctx = this.canvas.getContext("2d");
    this.rect = this.canvas.getBoundingClientRect();
    this.bodyRect = document.body.getBoundingClientRect()
    this.map = null;
  }
  startMap(mapConfig, heroInitialState = null) {
    // 初始地圖
    this.map = new OverworldMap(mapConfig)
    this.map.overworld = this
    // this.map.mountObjects()
    // this.progress.mapId = mapConfig.id
  }
  startGameLoop() {
    const step = () => {

      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx);

      //Draw Game Objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.sprite.draw(this.ctx);
      })

      //Draw Upper layer
      // this.map.drawUpperImage(this.ctx);


      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }
  bindActionInput() {
    this.element.addEventListener('click', (event) => {
      this.map.checkForActionCutscene(event, this.rect, this.bodyRect)
    })
  }

  async init() {
    const container = document.querySelector(".game-container")
    
    // Show title screen
    this.titleScreen = new TitleScreen({
      progress: this.progress
    })

    const useSaveFile = await this.titleScreen.init(container)

    this.startMap(window.OverworldMaps['firstScene'])
    this.bindActionInput()
    this.startGameLoop()
    this.map.startCutscene([{type: 'textMessage', text: '前情提要'}])
  }

}