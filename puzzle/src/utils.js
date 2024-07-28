export function shuffle(arr) {
  let i = arr.length;
  while (--i) {
      let j = Math.floor(Math.random() * i);
      [arr[j], arr[i]] = [arr[i], arr[j]];
  }
}

export function isNearby(arr, key, target) {
  const currentIndex = arr.findIndex(i => i === key);
  const targetIndex = arr.findIndex(i => i === target);
  const diff = Math.abs(currentIndex - targetIndex);
  // 4*4 matrix, same column or same row;
  return diff === 4 || (diff === 1 && (parseInt(currentIndex / 4) === parseInt(targetIndex / 4)));
}

export function getReverseNumber(arr) {
  let reverseNum = 0;
  for (let i = 1; i < arr.length; i++) {
    let j = i - 1;
    while(j >= 0) {
      if (arr[j] > arr[i]) {
        reverseNum += 1;
      }
      j--;
    }
  }
  return reverseNum;
}

export function hasSolution(key, reverseNum, initRow) {
  const row = parseInt((key - 1) / 4) + 1;
  const diff = Math.abs(row - initRow);
  const isRowDiffEven = diff % 2 === 0;
  const isReverseEven = reverseNum % 2 === 0;
  return isReverseEven === isRowDiffEven;
}
