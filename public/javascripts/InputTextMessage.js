class InputTextMessage {
  constructor({ text, answer, answerText, img, onComplete, width }) {
    this.text = text
    this.answerText = answerText
    this.answer = answer
    this.onComplete = onComplete
    this.element = null
    this.img = img
    this.width = width || 300
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('MessageBox')
    this.element.innerHTML = `
    <p class="TextMessage_p">${this.text}</p>
    <img class="MessageBox_img" src=${this.img} width="${this.width}" alt="一張圖片">
    <form class="form-inline">
    <label class="TextMessage_p" for="answer">${this.answerText}</label>
    
    <input class="TextInput" name="answer"></input>
    <button class="InputTextMessage_button cancel">Cancel</button>
    <button class="InputTextMessage_button send">Send</button>
    </form>

    `
    this.element.querySelector('.cancel').addEventListener('click', (e) => {
      e.preventDefault()
      this.done()
    })
    this.element.querySelector('.send').addEventListener('click', (e) => {
      let value = this.element.querySelector('.TextInput').value
      value = value.toUpperCase()
      e.preventDefault()
      if (value === this.answer) {
        this.done(true)
      } else {
        const message = new TextMessage({
          text: '好像不太對',
          onComplete: () => {return}
        })
        message.init(document.querySelector('.game-container'))
        this.done(false)
      }
    })
    this.actionListener = new KeyPressListener('Enter', () => {
      let value = this.element.querySelector('.TextInput').value
      value = value.toUpperCase()
      if (value === this.answer) {
        this.done(true)
      } else {
        const message = new TextMessage({
          text: '好像不太對',
          onComplete: () => { return }
        })
        message.init(document.querySelector('.game-container'))
        this.done(false)
      }
    })
  }
  done(solved) {
      this.element.remove()
      this.actionListener.unbind()
      this.onComplete(solved)
  }
  init(container) {
    this.createElement()
    container.appendChild(this.element)
    const parent = this.element.parentNode
    parent.addEventListener('click', (e) => {
      if (e.target.id === 'canvas') {
        this.done()
      }
    })
  }
}