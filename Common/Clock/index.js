function getValueIndex (val) {
  switch (val) {
    case '1': return [[1, 2], [3 ,2]];
    case '2': return [[0, 1], [1, 2], [2, 1], [3, 0], [4, 1]];
    case '3': return [[0, 1], [1, 2], [2, 1], [3, 2], [4, 1]];
    case '4': return [[1, 0], [1, 2], [2, 1], [3, 2]];
    case '5': return [[0, 1], [1, 0], [2, 1], [3, 2], [4, 1]];
    case '6': return [[0, 1], [1, 0], [2, 1], [2, 1], [3, 0], [3, 2], [4, 1]];
    case '7': return [[0, 1], [1, 2], [3, 2]];
    case '8': return [[0, 1], [1, 0], [1, 2], [2, 1], [3, 0], [3, 2], [4, 1]];
    case '9': return [[0, 1], [1, 0], [1, 2], [2, 1], [3, 2]];
    case '0': return [[0, 1], [1, 0], [1, 2], [3, 0], [3, 2], [4, 1]];
  }
}

function print (time) {
  const result = [
    [' ', '-', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', '-', ' '],
    ['|', ' ', '|', '|', ' ', '|', '~', '|', ' ', '|', '|', ' ', '|', '~', '|', ' ', '|', '|', ' ', '|'],
    [' ', '-', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', '-', ' '],
    ['|', ' ', '|', '|', ' ', '|', '~', '|', ' ', '|', '|', ' ', '|', '~', '|', ' ', '|', '|', ' ', '|'],
    [' ', '-', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', ' ', '-', ' ']
  ]

  let index = 0;

  console.log(time);

  for (const number of time.split('')) {
    if (number === ':') index += 1;
    else {
      const indexes = getValueIndex(number);
      for (let height = 0; height < 5; height++) {
        for (let width = 0; width < 3; width++) {
          const found = indexes.find(cell => cell[1] === width && cell[0] === height);
          if (!found) {
            result[height][width + index] = ' ';
          }
        }
      }
      index += 3;
    }
  }

  for (const row of result) {
    console.log(row.join(' '));
  }
}

function update () {
  let hour = new Date().getHours() + '';
  if (hour.length === 1) hour = '0' + hour;

  let minute = new Date().getMinutes() + '';
  if (minute.length === 1) minute = '0' + minute;

  let seconds = new Date().getSeconds() + '';
  if (seconds.length === 1) seconds = '0' + seconds;

  console.clear();
  print(`${hour}:${minute}:${seconds}`);``

  setTimeout(update, 1000);
}

update();
