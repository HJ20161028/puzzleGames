import { Direction } from "./models/enum";
import scoreMgr from "./scoreManager";

export function generateRandomNum() {
  // Probability of generating 2: 90%; 4: 10%
  const random = Math.random();
  return random > 0.1 ? 2 : 4;
}

export function putRandomNum2Arr(arr) {
  const emptyPositions = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === 0) {
      emptyPositions.push(i);
    }
  }
  const randomIndex = Math.floor(Math.random() * emptyPositions.length);
  const randomNum = generateRandomNum();
  arr[emptyPositions[randomIndex]] = randomNum;
  return randomIndex;
}

export function mergeSubArr(subArr) {
  let updated = false;
  let maxIndex = 0;
  for(let i = 3; i > 0; i -= 1) {
    maxIndex = i;
    for (let j = i - 1; j >= 0; j -= 1) {
      if (subArr[maxIndex] > 0) {
        if (subArr[maxIndex] === subArr[j]) {
          // merge cell;
          subArr[maxIndex] = 0;
          subArr[i] = subArr[j] * 2;
          scoreMgr.updateScore(subArr[i]);
          subArr[j] = 0;
          updated = true;
          break;
        } else if (subArr[j] === 0) {
          continue;
        } else {
          break;
        }
      } else {
        maxIndex = subArr[j] > 0 ? j : i;
      }
    }
    if (subArr[i] === 0 && maxIndex !== i) {
      subArr[i] = subArr[maxIndex];
      subArr[maxIndex] = 0;
      updated = true;
    }
  }
  return updated;
}


function mergeUp(arr) {
  let updated = false;
  for (let i = 0; i < 4; i += 1) {
    const subArr = [arr[i + 12], arr[i + 8], arr[i + 4], arr[i]];
    const colUpdated = mergeSubArr(subArr);
    updated = updated || colUpdated;
    arr[i] = subArr[3];
    arr[i + 4] = subArr[2];
    arr[i + 8] = subArr[1];
    arr[i + 12] = subArr[0];
  }
  return updated;
}

function mergeDown(arr) {
  let updated = false;
  for (let i = arr.length - 1; i > arr.length - 1 - 4; i -= 1) {
    const subArr = [arr[i - 12], arr[i - 8], arr[i - 4], arr[i]];
    const colUpdated = mergeSubArr(subArr);
    updated = updated || colUpdated;
    arr[i] = subArr[3];
    arr[i - 4] = subArr[2];
    arr[i - 8] = subArr[1];
    arr[i - 12] = subArr[0];
  }
  return updated;
}

function mergeRight(arr) {
  let updated = false;
  for (let i = 3; i <= arr.length - 1; i += 4) {
    const subArr = [arr[i - 3], arr[i - 2], arr[i - 1], arr[i]];
    const rowUpdated = mergeSubArr(subArr);
    updated = updated || rowUpdated;
    arr[i] = subArr[3];
    arr[i-1] = subArr[2];
    arr[i-2] = subArr[1];
    arr[i-3] = subArr[0];
  }
  return updated;
}

function mergeLeft(arr) {
  let updated = false;
  for (let i = 0; i <= arr.length - 1; i += 4) {
    const subArr = [arr[i + 3], arr[i + 2], arr[i + 1], arr[i]];
    const rowUpdated =  mergeSubArr(subArr);
    updated = updated || rowUpdated;
    arr[i] = subArr[3];
    arr[i+1] = subArr[2];
    arr[i+2] = subArr[1];
    arr[i+3] = subArr[0];
  }
  return updated;
}

export function merge(arr, direction) {
  switch(direction) {
    case Direction.Up:
      return mergeUp(arr);
    case Direction.Left:
      return mergeLeft(arr);
    case Direction.Right:
      return mergeRight(arr);
    default:
      return mergeDown(arr);
  }
}