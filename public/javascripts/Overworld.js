class Overworld {
  constructor(config) {
    this.element = config.element
    this.canvas = this.element.querySelector(".game-canvas")
    this.canvas.width = 640
    this.canvas.height = 320
    this.ctx = this.canvas.getContext("2d")
    this.rect = this.canvas.getBoundingClientRect()
    this.bodyRect = document.body.getBoundingClientRect()
    this.map = null
  }
  startMap(mapConfig, heroInitialState = null) {
    // 初始地圖
    this.map = new OverworldMap(mapConfig)
    this.map.overworld = this
    // this.map.mountObjects()
    this.progress.mapId = mapConfig.id
  }
  startGameLoop() {
    const step = () => {

      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx)

      //Draw Game Objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.sprite.draw(this.ctx)
      })

      //Draw Upper layer
      // this.map.drawUpperImage(this.ctx)


      requestAnimationFrame(() => {
        step()
      })
    }
    step()
  }
  bindActionInput() {

    this.element.addEventListener('click', (event) => {
      this.map.checkForActionCutscene(event, this.rect, this.bodyRect)
    })
  }

  async init() {
    const container = document.querySelector(".game-container")

    this.progress = new Progress()
    // Show title screen
    this.titleScreen = new TitleScreen({
      progress: this.progress
    })

    const useSaveFile = await this.titleScreen.init(container)

    if (useSaveFile) {
      this.progress.load()
    }

    this.startMap(window.OverworldMaps['thirdScene'])
    this.bindActionInput()
    this.startGameLoop()
    if (!useSaveFile) {
      this.map.startCutscene([
        { type: 'textMessage', text: '今天是婚禮的日子，一覺醒來發現張濰不見蹤影' },
        { type: 'textMessage', text: '只在桌上發現一張紙條' },
        { type: 'textMessage', text: '「我把房間的鎖換掉了，你一定可以解開的吧」' },
        { type: 'textMessage', text: '「我可是不會嫁給笨蛋的哦：）」' },
        { type: 'textMessage', text: '......' },
        { type: 'textMessage', text: '看來只能想辦法走出房門了，應該不會難到哪裡去吧' },
        { type: 'textMessage', text: '【玩法說明】' },
        { type: 'textMessage', text: '遊戲透過點擊進行，尋找線索' },
        { type: 'textMessage', text: '對話窗可按enter快速跳過' },
        { type: 'textMessage', text: '若已玩過同類型遊戲可快轉跳過' },
        { type: 'textMessage', text: '遊戲總共有四張場景，可透過兩邊的方向按鈕切換' },
        { type: 'textMessage', text: '畫面上的物品點擊後可能會出現說明文字(對話視窗)' },
        { type: 'textMessage', text: '對話視窗關閉前點擊其他地方是沒有效果的' },
        { type: 'textMessage', text: '需要透過說明文字或圖片的線索解開每張場景的謎題' },
        { type: 'textMessage', text: '輸入正確答案後可通關' },
        { type: 'textMessage', text: '如果卡關了可以點擊右上角觀看提示，或是跟尹維或張濰求救XD' },
        { type: 'textMessage', text: '時間不多了，我們趕緊就開始吧' },
        { type: "addStoryFlag", flag: "explained" }
      ])
    }
  }
}