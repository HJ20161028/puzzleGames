import { useState, useEffect, useRef } from 'react';
import './game.css';
import { shuffle, isNearby, getReverseNumber, hasSolution } from '../utils';
import dapingshanImg from '../assets/dapingshan.jpg';
import qilingtaImg from '../assets/qilingta.jpg';
import taishanImg from '../assets/taishan.jpg';
import teamImg from '../assets/team.jpg';

const Game = () => {
  const [oriImg, setOriImg] = useState(dapingshanImg);
  const [bgImgId, setBgImgId] = useState(0);
  const [imgIds, setImgIds] = useState([]);
  const [refreshTime, setRefreshTime] = useState(new Date().toGMTString());
  const [solution, setSolution] = useState(true);
  const [tips, setTips] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef({
    gameTimer: null,
    isTimerRuning: false,
  });
  const imgUnit = 200; // width/height = 200px;
  const blankKey = 9;
  function replay() {
    const nums = [];
    for (let i = 1; i <= 16; i += 1) {
      nums.push(i);
    }
    shuffle(nums);
    setTime(0);
    clearInterval(timerRef.current.gameTimer);
    timerRef.current.gameTimer = null;
    timerRef.current.isTimerRuning = false;
    console.log(`Ids: ${nums}`);
    const reverseNum = getReverseNumber(nums);
    const keyIndex = nums.findIndex((i) => i === blankKey);
    const initRow = parseInt(keyIndex / 4) + 1;
    const bool = hasSolution(blankKey, reverseNum, initRow);
    console.log(`有解？: ${bool}`);
    setSolution(bool);
    setImgIds(nums);
  }
  function stopGame() {
    clearInterval(timerRef.current.gameTimer);
    timerRef.current.gameTimer = null;
    timerRef.current.isTimerRuning = false;
    alert("恭喜你完成拼图！");
  }
  useEffect(() => {
    replay();
  },[refreshTime]);
  useEffect(() => {
    if (imgIds.length > 0) {
      const reverseNum = getReverseNumber(imgIds);
      if (reverseNum === 0) {
        stopGame();
      }
    }
  }, [imgIds]);
  function reSort(target) {
    if (!timerRef.current.gameTimer) {
      timerRef.current.isTimerRuning = true;
      timerRef.current.gameTimer = setInterval(() => {
        setTime((prev) => prev += 1);
      }, 1000);
    }
    setImgIds((prevImgIds) => {
      const isNear = isNearby(prevImgIds, blankKey, target);
      if (isNear) {
        const currentIndex = prevImgIds.findIndex(i => i === blankKey);
        const targetIndex = prevImgIds.findIndex(i => i === target);
        [prevImgIds[currentIndex], prevImgIds[targetIndex]] = [prevImgIds[targetIndex], prevImgIds[currentIndex]]
        return [...prevImgIds];
      }
      return prevImgIds;
    });
  }
  function pauseStartTimer() {
    if (timerRef.current.isTimerRuning) {
      clearInterval(timerRef.current.gameTimer);
      timerRef.current.isTimerRuning = false;
    } else {
      timerRef.current.isTimerRuning = true;
      timerRef.current.gameTimer = setInterval(() => {
        setTime((prev) => prev++ );
      }, 1000);
    }
  }
  function showTips() {
    setTips((prevState) => !prevState);
  }
  function replaceImg() {
    const imgArr = [dapingshanImg, qilingtaImg, taishanImg, teamImg]
    const index = Math.floor(Math.random() * 4);
    if (imgArr[index] === oriImg) {
      replaceImg();
    }
    setOriImg(imgArr[index]);
    setBgImgId(index);
    return imgArr[index];
  }
  return <div className="game-root">
    <div className="actions">
      <button className='green-btn' type="button" onClick={pauseStartTimer}>暂停/开始</button>
      <button className='red-btn' type="button" onClick={() => setRefreshTime(new Date().toGMTString())}>重开</button>
      <button className='green-btn' type="button" onClick={showTips}>提示一下</button>
      <button className='green-btn' type="button" onClick={replaceImg}>换图</button>
    </div>
    <div className="status">
      <div className="predict-container">
        <span className="title">拼图是否有解预测结果：</span>
        <span className="predict">{solution ? '有解' : '无解'}</span>
      </div>
      <div className="timer-container">
        <span className="title">游戏用时：</span>
        <span className="time">{time}秒</span>
      </div>
      <img src={oriImg} alt=" " className="orgin-img" />
    </div>
    <div className="puzzle">
      {imgIds.map((item) => {
        const intItem = parseInt(item, 10);
        const left = -((intItem - 1) % 4) * imgUnit;
        const top = -parseInt((intItem - 1) / 4) * imgUnit;
        const imgStyle = {
          backgroundPosition: `${left}px ${top}px`,
        };
        return (
        <div
          key={item}
          id={`bg-${bgImgId}`}
          className={tips ? `img-${item} img-item show-tips` : `img-${item} img-item hide-tips`}
          style={imgStyle}
          onClick={() => reSort(item)}
          >
            <span className='tips'>
              {item === blankKey ? '请拼图' : item}
            </span>
        </div>);
      })}
    </div>
  </div>
}

export default Game;