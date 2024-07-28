class ScoreManager {
  constructor() {
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  updateScore(increaseScore) {
    this.score += increaseScore;
  }

  reset() {
    this.score = 0;
  }
}

const scoreMgr = new ScoreManager();
export default scoreMgr;