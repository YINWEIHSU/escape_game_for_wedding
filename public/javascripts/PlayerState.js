class PlayerState {
  constructor() {
    this.storyFlags = {
      "explained": false,
      "firstOpened": false,
      "secondOpened": false,
      "thirdOpened": false,
      "fourthOpened": false,
      "finalOpened": false,
      "firstSceneClue": 0,
      "secondSceneClue": 0,
      "thirdSceneClue": 0,
      "fourthSceneClue": 0,
      "finalSceneClue": 0
    }
  }

}
window.playerState = new PlayerState()