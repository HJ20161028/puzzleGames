import Game from "./components/game";
const App = () => {
  return <div className="app-entry">
    <div className="gradient-text">
      <p>移动方块合成2048！支持键盘操作哦！</p>
    </div>
    <Game />
  </div>
}

export default App;