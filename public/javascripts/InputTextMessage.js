class InputTextMessage {
  constructor({ text, answer, onComplete }) {
    this.text = text
    this.answer = answer
    this.onComplete = onComplete
    this.element = null
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('TextMessage')

    this.element.innerHTML = `
    <form class="form-inline">
    <label class="InputTextMessage_p" for="answer">${this.text}</label>
    <input class="TextInput" name="answer"></input>
    <button class="InputTextMessage_button cancel">Cancel</button>
    <button class="InputTextMessage_button send">Send</button>
    </form>

    `

    this.element.querySelector('.cancel').addEventListener('click', () => {
      this.done()
    })
    this.element.querySelector('.send').addEventListener('click', (e) => {
      const value = this.element.querySelector('.TextInput').value
      e.preventDefault()
      if (value === this.answer) {
        alert('答對了')
        this.done()
      } else {
        alert('答錯了')
      }
    })
    this.actionListener = new KeyPressListener('Enter', () => {
      this.done()
    })
  }
  done() {
      this.element.remove()
      this.actionListener.unbind()
      this.onComplete()
  }
  init(container) {
    this.createElement()
    container.appendChild(this.element)
  }
}