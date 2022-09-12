class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {}
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    // this.upperImage = new Image();
    // this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false
  }
  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0)
  }

  // drawUpperImage(ctx) {
  //   ctx.drawImage(this.upperImage, 0, 0)
  // }

  checkForActionCutscene(event, rect, bodyRect) {
    const match = Object.values(this.gameObjects).find(object => {
      const x = event.layerX + 1
      const y = event.layerY - 95
      // console.log(rect.left, rect.top, bodyRect.left, bodyRect.top, event.layerX, event.layerY)
      if (x > object.x && x < object.x + 32 && y > object.y && y < object.y + 32) {
        return true
      }

    })
    if (!this.isCutscenePlaying && match && match.touching.length) {
      const relevantScenario = match.touching.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true

    // Start a loop async events
    // await each one
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this
      })
      const result = await eventHandler.init()
      if (result === "UNSOLVED") {
        break
      }
    }

    this.isCutscenePlaying = false
  }
}

window.OverworldMaps = {
  firstScene: {
    id: "firstScene",
    lowerSrc: "/images/maps/firstScene.png",
    gameObjects: {
      leftButton: new GameObject({
        x: utils.withGrid(0),
        y: utils.withGrid(4),
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'fourthScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: utils.withGrid(19),
        y: utils.withGrid(4),
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'secondScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: utils.withGrid(10),
        y: utils.withGrid(6),
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'messageBox', text: "為什麼電子鎖會是鎖裡面的人", img: "/images/maps/lockAll.png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '1203', answerImage: "/images/maps/lockAll.png" }
            ]
          }
        ]
      }),
      lock2: new GameObject({
        x: utils.withGrid(10),
        y: utils.withGrid(7),
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'messageBox', text: "為什麼電子鎖會是鎖裡面的人", img: "/images/maps/lockAll.png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '1203', answerImage: '/images/maps/lockAll.png' }
            ]
          }
        ]
      })
    }
  },
  secondScene: {
    id: "secondScene",
    lowerSrc: "/images/maps/secondScene.png",
    gameObjects: {
      leftButton: new GameObject({
        x: utils.withGrid(0),
        y: utils.withGrid(4),
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'firstScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: utils.withGrid(19),
        y: utils.withGrid(4),
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'thirdScene' }] }
        ]
      })
    }
  },
  thirdScene: {
    id: "thirdScene",
    lowerSrc: "/images/maps/thirdScene.png",
    gameObjects: {
      leftButton: new GameObject({
        x: utils.withGrid(0),
        y: utils.withGrid(4),
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'secondScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: utils.withGrid(19),
        y: utils.withGrid(4),
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'fourthScene' }] }
        ]
      })
    }
  },
  fourthScene: {
    id: "fourthScene",
    lowerSrc: "/images/maps/fourthScene.png",
    gameObjects: {
      leftButton: new GameObject({
        x: utils.withGrid(0),
        y: utils.withGrid(4),
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'thirdScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: utils.withGrid(19),
        y: utils.withGrid(4),
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'firstScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: utils.withGrid(14),
        y: utils.withGrid(1),
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: [
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "是個好明顯的保險箱", img: "/images/maps/lockBox.png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '1203', answerImage: "/images/maps/lockAll.png" },
              { type: "textMessage", text: "喀擦！" },
              { type: "addStoryFlag", flag: "fourthOpened" },
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          }
        ]
      }),
      lock2: new GameObject({
        x: utils.withGrid(14),
        y: utils.withGrid(2),
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: [
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "是個好明顯的保險箱", img: "/images/maps/lockBox.png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '1203', answerImage: "/images/maps/lockAll.png" },
              { type: "textMessage", text: "喀擦！" },
              { type: "addStoryFlag", flag: "fourthOpened" },
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          }
        ]
      }),
      lock3: new GameObject({
        x: utils.withGrid(15),
        y: utils.withGrid(1),
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: [
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "是個好明顯的保險箱", img: "/images/maps/lockBox.png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '1203', answerImage: "/images/maps/lockAll.png" },
              { type: "textMessage", text: "喀擦！" },
              { type: "addStoryFlag", flag: "fourthOpened" },
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          }
        ]
      }),
      lock4: new GameObject({
        x: utils.withGrid(15),
        y: utils.withGrid(2),
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: [
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "是個好明顯的保險箱", img: "/images/maps/lockBox.png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '1203', answerImage: "/images/maps/lockAll.png" },
              { type: "textMessage", text: "喀擦！" },
              { type: "addStoryFlag", flag: "fourthOpened" },
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          }
        ]
      }),
    }
  }
}