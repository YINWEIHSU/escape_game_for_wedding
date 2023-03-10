class GameObject {
  constructor(config) {
    this.id = null
    this.x = config.x || 0
    this.y = config.y || 0
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/npc1.png",
    })
    this.touching = config.touching || []
  }
}