class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects
    this.cutsceneSpaces = config.cutsceneSpaces || {}
    this.lowerImage = new Image()
    this.lowerImage.src = config.lowerSrc
    this.isCutscenePlaying = false
    this.isPaused = false
  }
  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0)
  }

  checkForActionCutscene(event) {
    const match = Object.values(this.gameObjects).find(object => {
      const x = event.layerX + 1
      const y = event.layerY - 95
      const xMaxIndex = object.x.length - 1
      const yMaxIndex = object.y.length - 1
      if (x > object.x[0] && x < object.x[xMaxIndex] + 32 && y > object.y[0] && y < object.y[yMaxIndex] + 32) {
        return true
      }
    })
    if (!this.isCutscenePlaying && !this.isPaused && match && match.touching.length) {
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
      clue: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(0)],
        src: "/images/characters/help.png",
        touching: [
          {
            required: ["firstOpened", "secondOpened", "thirdOpened", "fourthOpened"],
            events: [
              { type: 'pause', isFinal: true }
            ]
          },
          {
            events: [
              { type: 'pause' }
            ]
          }
        ]
      }),
      leftButton: new GameObject({
        x: [utils.withGrid(0)],
        y: [utils.withGrid(4)],
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'fourthScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(4)],
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'secondScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: [utils.withGrid(10)],
        y: [utils.withGrid(6), utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'inputTextMessage', text: '???????????????????????????', answerText: '?????????????????????:', answer: '1745', img: "/images/maps/lockAll.png", width: 200 },
              { type: "addStoryFlag", flag: "finalOpened" },
              { type: 'changeMap', map: 'finishScene' },
              { type: "textMessage", text: "??????????????????" },
              { type: "textMessage", text: "?????????????????????????????????????????????????????????" },
              { type: "textMessage", text: "???????????????Dress Code????????????????????????" },
              { type: "textMessage", text: "????????????????????????????????????????????????" }
            ]
          }
        ]
      }),
      desktop: new GameObject({
        x: [utils.withGrid(4), utils.withGrid(5)],
        y: [utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["firstOpened"],
            events: [
              { type: 'messageBox', text: "?????????????????????", img: "/images/maps/desktop(open).png" }
            ]
          },
          {
            events: [
              { type: 'inputTextMessage', text: '??????????????????????????????????????????????????????????????????????????????????????????', answerText: '?????????????????????:', answer: 'BLUE', img: "/images/maps/desktop.png" },
              { type: "textMessage", text: "(????????????)" },
              { type: "addStoryFlag", flag: "firstOpened" },
              { type: 'messageBox', text: "????????????????????????????????????????????????", img: "/images/maps/desktop(open).png" }
            ]
          }
        ]
      }),
      keyboard: new GameObject({
        x: [utils.withGrid(4), utils.withGrid(5)],
        y: [utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["firstOpened"],
            events: [
              { type: 'messageBox', text: "?????????????????????", img: "/images/maps/desktop(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "??????????????????", img: "/images/maps/keyboard.png" }
            ]
          }
        ]
      }),
      draw: new GameObject({
        x: [utils.withGrid(16), utils.withGrid(18)],
        y: [utils.withGrid(4), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["finalOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "??????????????????????????????", img: "/images/maps/draw.png" }
            ]
          }
        ]
      }),
      sofa: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(2)],
        y: [utils.withGrid(6), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "???????????????????????????" }
            ]
          }]
      }),
      cabinet: new GameObject({
        x: [utils.withGrid(3), utils.withGrid(7)],
        y: [utils.withGrid(8), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "?????????????????????????????????" }
            ]
          }]
      }),
      package: new GameObject({
        x: [utils.withGrid(13), utils.withGrid(14)],
        y: [utils.withGrid(6), utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "?????????????????????????????????" }
            ]
          }]
      })
    }
  },
  secondScene: {
    id: "secondScene",
    lowerSrc: "/images/maps/secondScene.png",
    gameObjects: {
      clue: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(0)],
        src: "/images/characters/help.png",
        touching: [
          {
            required: ["firstOpened", "secondOpened", "thirdOpened", "fourthOpened"],
            events: [
              { type: 'pause', isFinal: true }
            ]
          },
          { events: [{ type: 'pause' }] }
        ]
      }),
      leftButton: new GameObject({
        x: [utils.withGrid(0)],
        y: [utils.withGrid(4)],
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'firstScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(4)],
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'thirdScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: [utils.withGrid(16)],
        y: [utils.withGrid(3)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: 'messageBox', text: "??????????????????????????????", img: "/images/maps/treasureBox(open).png" }
            ]
          },
          {
            events: [
              { type: 'inputTextMessage', text: '???????????????????????????????????????????????????', answerText: '???????????????:', answer: 'WEI', img: "/images/maps/treasureBox(close).png" },
              { type: "textMessage", text: "?????????" },
              { type: "addStoryFlag", flag: "secondOpened" },
              { type: 'messageBox', text: "??????????????????????????????", img: "/images/maps/treasureBox(open).png" }
            ]
          }
        ]
      }),
      paper: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(16)],
        y: [utils.withGrid(1)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "??????????????????????????????????????????????????????????????????????????????", img: "/images/maps/paper.png" }
            ]
          }
        ]
      }),
      refrig1: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(16)],
        y: [utils.withGrid(4), utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "[????????????]??????????????????????????????", img: "/images/maps/refrig-up.png" }
            ]
          }
        ]
      }),
      logo: new GameObject({
        x: [utils.withGrid(17)],
        y: [utils.withGrid(4), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "[????????????]??????????????????????????????", img: "/images/maps/refrig-up.png" },
              {type: 'textMessage', text: "??????????????????????????????????????????????????????????????????????????????"}
            ]
          }
        ]
      }),
      refrig2: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(17)],
        y: [utils.withGrid(7), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "[????????????]????????????????????????????????????...", img: "/images/maps/refrig-down.png" }
            ]
          }
        ]
      }),
      dinner: new GameObject({
        x: [utils.withGrid(5), utils.withGrid(8)],
        y: [utils.withGrid(5), utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "???????????????..." }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "?????????????????????????????????????????????????????????????????????" }
            ]
          }
        ]
      }),
      cabbage: new GameObject({
        x: [utils.withGrid(9)],
        y: [utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "???????????????..." }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "?????????????????????????????????" }
            ]
          }
        ]
      }),
      milk: new GameObject({
        x: [utils.withGrid(10), utils.withGrid(11)],
        y: [utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "???????????????..." }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "??????????????????????????????????????????" }
            ]
          }
        ]
      }),
      sandwich: new GameObject({
        x: [utils.withGrid(12)],
        y: [utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "???????????????..." }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "??????????????????????????????????????????????????????" }
            ]
          }
        ]
      }),
      cabinet1: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(13)],
        y: [utils.withGrid(0), utils.withGrid(3)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "???????????????" }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "?????????????????????????????????????????????" }
            ]
          }
        ]
      }),
      cabinet2: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(13)],
        y: [utils.withGrid(7), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "???????????????" }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "?????????????????????????????????????????????" }
            ]
          }
        ]
      }),
      box: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(15)],
        y: [utils.withGrid(2), utils.withGrid(3)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "?????????????????????" }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "?????????????????????" }
            ]
          }
        ]
      })

    }
  },
  thirdScene: {
    id: "thirdScene",
    lowerSrc: "/images/maps/thirdScene.png",
    gameObjects: {
      clue: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(0)],
        src: "/images/characters/help.png",
        touching: [
          {
            required: ["firstOpened", "secondOpened", "thirdOpened", "fourthOpened"],
            events: [
              { type: 'pause', isFinal: true }
            ]
          },
          { events: [{ type: 'pause' }] }
        ]
      }),
      leftButton: new GameObject({
        x: [utils.withGrid(0)],
        y: [utils.withGrid(4)],
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'secondScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(4)],
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'fourthScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: [utils.withGrid(13), utils.withGrid(18)],
        y: [utils.withGrid(2), utils.withGrid(4)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: [
              { type: 'messageBox', text: "???????????????", img: "/images/maps/map(open).png" }
            ]
          },
          {
            events: [
              { type: 'inputTextMessage', text: '?????????????????????????????????????????????????????????', answerText: '???????????????????????????:', answer: '0692', img: "/images/maps/map.png" },
              { type: "textMessage", text: "(???????????????)" },
              { type: "addStoryFlag", flag: "thirdOpened" },
              { type: 'messageBox', text: "???????????????", img: "/images/maps/map(open).png" }
            ]
          }
        ]
      }),
      photo1: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(2)],
        y: [utils.withGrid(4), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: [{ type: 'messageBox', text: "????????????????????????", img: "/images/maps/photo1.png", width: 200 }]
          },
          {
            events: [
              { type: 'messageBox', text: "???????????????????????????", img: "/images/maps/photo1.png", width: 200 }
            ]
          }
        ]
      }),
      photo2: new GameObject({
        x: [utils.withGrid(4), utils.withGrid(7)],
        y: [utils.withGrid(4), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: [
              { type: 'messageBox', text: "??????????????????????????????????????????", img: "/images/maps/photo2.png", width: 300 }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "???????????????????????????????????????", img: "/images/maps/photo2.png", width: 300 }
            ]
          }
        ]
      }),
      photo3: new GameObject({
        x: [utils.withGrid(9), utils.withGrid(10)],
        y: [utils.withGrid(3), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: [
              { type: 'messageBox', text: "?????????????????????", img: "/images/maps/photo3.png", width: 120 }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "?????????????????????????????????", img: "/images/maps/photo3.png", width: 120 }
            ]
          }
        ]
      }),
      photo4: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(7)],
        y: [utils.withGrid(1), utils.withGrid(2)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: [
              { type: 'messageBox', text: "?????????????????????", img: "/images/maps/photo4.png", width: 310 }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "???????????????????????????", img: "/images/maps/photo4.png", width: 310 }
            ]
          }
        ]
      }),
      chair: new GameObject({
        x: [utils.withGrid(16), utils.withGrid(17)],
        y: [utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "?????????????????????????????????????????????????????????????????????" }
            ]}]
      }),
      bed: new GameObject({
        x: [utils.withGrid(3), utils.withGrid(11)],
        y: [utils.withGrid(6), utils.withGrid(8)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "?????????????????????" }
            ]
          }]
      })
    }
  },
  fourthScene: {
    id: "fourthScene",
    lowerSrc: "/images/maps/fourthScene.png",
    gameObjects: {
      clue: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(0)],
        src: "/images/characters/help.png",
        touching: [
          {
            required: ["firstOpened", "secondOpened", "thirdOpened", "fourthOpened"],
            events: [
              { type: 'pause', isFinal: true }
            ]
          },
          { events: [{ type: 'pause' }] }
        ]
      }),
      leftButton: new GameObject({
        x: [utils.withGrid(0)],
        y: [utils.withGrid(4)],
        src: "/images/characters/leftButton.png",
        touching: [
          {
            events: [{ type: 'changeMap', map: 'thirdScene' }]
          }
        ]
      }),
      rightButton: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(4)],
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'firstScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(15)],
        y: [utils.withGrid(1), utils.withGrid(2)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: [
              { type: 'messageBox', text: "??????????????????????????????", img: "/images/maps/lockBox(open).png" }
            ]
          },
          {
            events: [
              { type: 'inputTextMessage', answerText: '???????????????:', text: '????????????????????????????????????', answer: '1203', img: "/images/maps/lockBox.png" },
              { type: "textMessage", text: "?????????" },
              { type: "addStoryFlag", flag: "fourthOpened" },
              { type: 'messageBox', text: "??????????????????????????????", img: "/images/maps/lockBox(open).png" }
            ]
          }
        ]
      }),
      tv1: new GameObject({
        x: [utils.withGrid(7), utils.withGrid(11)],
        y: [utils.withGrid(4), utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "??????????????????????????????????????????", img: "/images/maps/television.png" }
            ]
          }
        ]
      }),
      switch: new GameObject({
        x: [utils.withGrid(12), utils.withGrid(13)],
        y: [utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "?????????????????????????????????" }
            ]
          }
        ]
      }),
      recycle: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(15)],
        y: [utils.withGrid(8), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: []
          },
          {
            events: [
              { type: 'textMessage', text: "????????????????????????????????????" }
            ]
          }
        ]
      }),
      trsc: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(3)],
        y: [utils.withGrid(4)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "??????????????????????????????" }
            ]
          }
        ]
      }),
      statue: new GameObject({
        x: [utils.withGrid(4)],
        y: [utils.withGrid(4)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "????????????????????????????????????" }
            ]
          }
        ]
      }),
      cabinet: new GameObject({
        x: [utils.withGrid(5), utils.withGrid(13)],
        y: [utils.withGrid(8), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'textMessage', text: "?????????????????????????????????????????????" }
            ]
          }
        ]
      })

    }
  },
  finishScene: {
    id: "finishScene",
    lowerSrc: "/images/maps/finalScene.png",
    gameObjects: {}
  }
}