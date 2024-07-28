import { useState, useEffect, useRef } from 'react'
import './game.css'
import { putRandomNum2Arr, merge } from '../utils';
import { Direction } from '../models/enum';
import scoreMgr from '../scoreManager';

function Tiles(props) {
  const { tiles, newIndex } = props;
  const content = [];
  tiles.forEach((t, i) => {
    if (t > 0) {
      content.push((
        <div key={`tile${i}`} className={`tile tile-${t} tile-position-${i} ${newIndex === i ? 'tile-new' : ''}`}>{t}</div>
      ));
    }
  });
  return content;
}

export default function Game() {
  const [grid, setGrid] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [newIndex, setNewIndex] = useState(0);
  const [activeDirc, setActiveDirc] = useState();
  const [score, setScore] = useState(0);
  const [additionScore, setScoreAddition] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const tilesRef = useRef();
  const scoreRef = useRef();
  const mergeAudioRef = useRef();
  const nomergeAudioRef = useRef();
  tilesRef.current = tiles;
  scoreRef.current = score;
  const [refreshTime, setRefrehTime] = useState();

  function initGame() { // 4x4 grid, init and manage data with One dimensional array[] 16.
    const arr = [];
    let i = 0
    while ( i < 16) {
      arr[i] = 0;
      i += 1;
    }
    const randomIndex1 = Math.floor(Math.random() * 16);
    const randomIndex2 = Math.floor(Math.random() * 16);
    arr[randomIndex1] = 2;
    arr[randomIndex2] = 2;
    setTiles(arr);
    setGrid([...arr]);
    scoreMgr.reset();
    setScore(0);
    setGameOver(false);
  }

  function checkGameOver() {
    const currentTiles = [...tilesRef.current];
    const availableTiles = currentTiles.filter((i) => i === 0);
    if (availableTiles.length === 0) {
      const canMove = merge(currentTiles, Direction.Down) || merge(currentTiles, Direction.Down);
      return !canMove;
    }
    return false;
  }

  function move(dirction) {
    setActiveDirc(dirction);
    setTimeout(() => {
      setActiveDirc(null);
    }, 500)
    const canMove = merge(tilesRef.current, dirction);
    if (canMove) {
      const randomIndex = putRandomNum2Arr(tilesRef.current);
      setTiles([...tilesRef.current]);
      setNewIndex(randomIndex);
      const increcement = scoreMgr.getScore() - scoreRef.current;
      setScoreAddition(increcement);
      setScore(scoreMgr.getScore());
      if (increcement > 0) {
        mergeAudioRef.current.play();
      } else {
        nomergeAudioRef.current.play();
      }
    } else {
      setScoreAddition(0);
      const isOver = checkGameOver();
      setGameOver(isOver);
    }
  }

  function listenKeyDown() {
    document.onkeydown = function(e) {
      e = e || window.event;
      const { key} = e;
      switch (key) {
        case 'ArrowLeft':
          move(Direction.Left);
          break;
        case 'ArrowUp':
          move(Direction.Up);
          break;
        case 'ArrowRight':
          move(Direction.Right);
          break;
        case 'ArrowDown':
          move(Direction.Down);
          break;
        default:
          break;
      }
    };
  }

  useEffect(() => {
    initGame();
    listenKeyDown();
  }, [refreshTime]);

  return (<div className="game-root">
    <div className="game-pannel">
      <div className="score">
        SCORE:
        <span className="value">{score}</span>
        {(additionScore > 0 && activeDirc !== null) && <div className="score-addition">+{additionScore}</div>}
      </div>
      <button type='button' onClick={() => setRefrehTime(new Date().toGMTString())}>重新开始</button>
    </div>
    {gameOver && (<div className="game-over">
      <p className="message">Game Over!</p>
      <button type='button' onClick={() => setRefrehTime(new Date().toGMTString())}>再试一次！</button>
    </div>)}
    {!gameOver && (<div className="operation-area">
      <button type='button' className={`arrow-btn up-btn ${activeDirc === Direction.Up ? 'animate-btn' : ''}`} onClick={() => move(Direction.Up)}>↑</button>
      <button type='button' className={`arrow-btn right-btn ${activeDirc === Direction.Right ? 'animate-btn' : ''}`} onClick={() => move(Direction.Right)}>→</button>
      <button type='button' className={`arrow-btn down-btn ${activeDirc === Direction.Down ? 'animate-btn' : ''}`} onClick={() => move(Direction.Down)}>↓</button>
      <button type='button' className={`arrow-btn left-btn ${activeDirc === Direction.Left ? 'animate-btn' : ''}`} onClick={() => move(Direction.Left)}>←</button>
    </div>)}
    {grid.map((item, index) => (
      <div key={`grid-${index}`} className="grid-cell" />
    ))}
    <div className="tile-container">
      <Tiles tiles={tiles} newIndex={newIndex} />
    </div>
    <div className="audio">
      <audio ref={mergeAudioRef} src="/merge.mp3" preload></audio>
      <audio ref={nomergeAudioRef} src="/nomerge.mp3" preload></audio>
    </div>
  </div>)
}