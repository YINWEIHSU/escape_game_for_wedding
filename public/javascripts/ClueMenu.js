class ClueMenu {
  constructor({ progress, content, onComplete, isFinal }) {
    this.progress = progress
    this.content = content
    this.onComplete = onComplete
    this.isFinal = isFinal
  }

  getOption(pageKey) {
    if (pageKey === 'root') {
      const mapId = this.isFinal?'finalScene':this.progress.mapId
      const storyFlags = window.playerState.storyFlags

      return [
        {
          label: `${window.Clues[mapId][storyFlags[`${mapId}Clue`]]['description']}`,
          description: '得到提示',
          handler: () => {
            const message = new TextMessage({
              text: `${window.Clues[mapId][storyFlags[`${mapId}Clue`]]['content']}`,
              onComplete: () => { return }
            })
            if (storyFlags[`${mapId}Clue`] + 1 < window.Clues[mapId].length) {
              storyFlags[`${mapId}Clue`] += 1
            }

            message.init(document.querySelector('.game-container'))
            this.close()
          }
        },
        {
          label: '我點錯了，我不需要提示',
          description: '我決定再想想',
          handler: () => {
            const message = new TextMessage({
              text: '我相信你可以的',
              onComplete: () => { return }
            })
            message.init(document.querySelector('.game-container'))
            this.close()
          }
        }
      ]
    }
    return []
  }

  createElement() {
    this.element = document.createElement("div")
    this.element.classList.add('ClueMenu')
    this.element.innerHTML = `
      <h2>提示列表</h2>
      <img src="images/characters/wei.png" width="100" alt="一張圖片">
    `
  }


  close() {
    // this.esc?.unbind()
    this.keyboardMenu.end()
    this.element.remove()
    this.onComplete()
  }

  init(container) {
    this.createElement()
    this.keyboardMenu = new Menu({
      descriptionContainer: container
    })
    this.keyboardMenu.init(this.element)
    this.keyboardMenu.setOptions(this.getOption('root'))

    container.appendChild(this.element)

    // 讓它不會開啟同時馬上關閉
    // utils.wait(200)
    // this.esc = new KeyPressListener('Escape', () => {
    //   this.close()
    // })

  }

}

window.Clues = {
  firstScene: [
    {
      content: '可以看看筆電的鍵盤，應該就可以發現前進的方向。',
      description: '我毫無頭緒，該從哪裡開始？'
    },
    {
      content: '提示翻譯成英文是什麼呢？',
      description: '我已經知道提示代表的意思了，但不知道要輸入什麼？'
    },
    {
      content: '按照鍵盤輸入可以得到藍色，翻譯成英文就是BLUE',
      description: '我還是解不出來，直接告訴我答案吧'
    },
    {
      content: '藍色是我們的dress code唷',
      description: '沒有更多提示啦'
    }
  ],
  secondScene: [
    {
    content: '藏寶箱上的兩樣物品都確定數量了嗎？',
    description: '我毫無頭緒，該從哪裡開始？'
    },
    {
      content: '提示最下面有提示物品與答案格的對應，可以參考牆上英數字海報推敲',
      description: '我知道物品代表的數字了，接下來該怎麼做？'
    },
    {
      content: '3順時針90度是W，8可以拆成EI',
      description: '我還是解不出來，直接告訴我答案吧'
    },
    {
      content: '新郎與新娘都是Wei哦！',
      description: '沒有更多提示啦'
    }
  ],
  thirdScene: [
    {
      content: '地圖下面看起來是一串座標，形狀好像跟畫面中的東西有對應到。',
      description: '我毫無頭緒，該從哪裡開始？'
    },
    {
      content: '地圖下面有一個小人，跟照片的人有關係嗎？',
      description: '我已經找到對應的物品了，然後呢？'
    },
    {
      content: '牆上照片裡的人數就是相對應的數字',
      description: '我還是解不出來，直接告訴我答案吧'
    },
    {
      content: '答案是餐廳的座標，不要跑錯地方了哦！',
      description: '沒有更多提示啦'
    }
  ],
  fourthScene: [
    {
      content: '現場最奇怪的就是電視了，再仔細看看吧',
      description: '我毫無頭緒，該從哪裡開始？'
    },
    {
      content: '如果將彩色的部分反黑，只看白色的部分呢',
      description: '好像有點想法，但還是不知道怎麼看。'
    },
    {
      content: '白色的部分仔細看可以看出英文，拼出來就是四個數字',
      description: '我還是解不出來，直接告訴我答案吧'
    },
    {
      content: '答案是婚禮的日期，期待跟你見面哦！',
      description: '沒有更多提示啦'
    }
  ],
  finalScene: [
    {
      content: '收集到的四顆扭蛋顏色好像同時出現在一個地方。',
      description: '我毫無頭緒，該去哪裡找線索？'
    },
    {
      content: '按照順序排出來會是什麼呢？',
      description: '好像有點想法，但還是不知道怎麼看。'
    },
    {
      content: '是數字密碼鎖，扭蛋內的紙條如果看成不是英文而是看成數字的話...',
      description: '我還是解不出來，直接告訴我答案吧'
    },
    {
      content: '答案是報到的時間(1745)，請準時抵達哦！',
      description: '沒有更多提示啦'
    }
  ]
}