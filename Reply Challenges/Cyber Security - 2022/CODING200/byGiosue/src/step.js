const { directions } = require('./config');
module.exports.stepFunction = function() {
  var self = this;

  self.solutions = [];
  self.countSolution = 0;
  self.step2 = function (matrix, player, direction, solution, portalCount, finalPosition) {
    matrix = setPLayerPositionAsUsed(matrix, player);
    let _matrix = JSON.parse(JSON.stringify(matrix));
    let __solution = JSON.parse(JSON.stringify(solution));
    _matrix = addBlackHoles(_matrix);
    
    let nextX = player.x + direction.x;
    let nextY = player.y + direction.y;
    __solution.push(direction.char);
    self.countSolution++;

    if(nextX < 0 || nextY < 0 || nextX >= _matrix.length || nextY >= _matrix[0].length) {
      //console.log("******** PERCORSO FALLITO ********")
      return null;
    }
    let nextCell = _matrix[nextX][nextY];
  
    let _player = {...player};
    if(nextCell == '&' || nextCell == '*' || nextCell == '?'){
      //console.log("******** PERCORSO FALLITO ********")
      return null;
    }
    if (__solution.length > 16 || portalCount > 3)
      return null;
    if (nextX == finalPosition.x && nextY == finalPosition.y) {
      self.solutions.push({directions: __solution, portalUsed: portalCount});
      return null;
    }
    if(/[a-z]/.test(nextCell)){ //portal
      matrix = setPLayerPositionAsUsed(JSON.parse(JSON.stringify(matrix)), {x: nextX, y: nextY});
      _player = findTwinPortal(matrix, nextCell, {x: nextX, y: nextY});
      matrix = setPLayerPositionAsUsed(JSON.parse(JSON.stringify(matrix)), {x: _player.x, y: _player.y});
      portalCount++;
    }
    else //no portal
      _player = {x: nextX, y: nextY};

      _matrix = addAndRemoveBlackHoles(JSON.parse(JSON.stringify(matrix)));

    for(let i=0; i<4; i++){
      let _direction = directions[i];
      let sol = self.step2(_matrix,{..._player}, _direction, __solution,portalCount, finalPosition);

    }
    //console.log("******** PERCORSO FALLITO ********")
    return null;
  }
  // * is used to mark the player position
  function setPLayerPositionAsUsed(_matrix, player){
    _matrix[player.x][player.y] = "*";
    return _matrix;
  }
  function addBlackHoles(_matrix){
    let __matrix = JSON.parse(JSON.stringify(_matrix));
    for(let i = 0; i < _matrix.length; i++){
      for(let j = 0; j < _matrix[i].length; j++){
        //add
        if(_matrix[i][j] == "."){
          let count = checkBlackHoleAroud(_matrix, i, j);
          if (count >= 3)
            __matrix[i][j] = "&";//created black hole
        }
        if( _matrix[i][j] == "*"){
          let count = checkBlackHoleAroud(_matrix, i, j);
          if (count >= 3)
            __matrix[i][j] = "?";//created black hole
        }
        if(/[a-z]/.test(_matrix[i][j])){
          let count = checkBlackHoleAroud(_matrix, i, j);
          let twinPortal = findTwinPortal(_matrix, _matrix[i][j], {x: i, y: j});
          if (count >= 3){
            __matrix[i][j] = "&";//created black hole
            if(!twinPortal)
              console.log("twinPortal not found");
            __matrix[twinPortal.x][twinPortal.y] = "&";//created black hole
          }
        }
      }
    }
    return __matrix;
  }
  function addAndRemoveBlackHoles(_matrix){
    let __matrix = JSON.parse(JSON.stringify(_matrix));
    for(let i = 0; i < _matrix.length; i++){
      for(let j = 0; j < _matrix[i].length; j++){
        //add
        if(_matrix[i][j] == "."){
          let count = checkBlackHoleAroud(_matrix, i, j);
          if (count >= 3)
            __matrix[i][j] = "&";//created black hole
        }
        if( _matrix[i][j] == "*"){
          let count = checkBlackHoleAroud(_matrix, i, j);
          if (count >= 3)
            __matrix[i][j] = "?";//created black hole
        }
        if(/[a-z]/.test(_matrix[i][j])){
          let count = checkBlackHoleAroud(_matrix, i, j);
          let twinPortal = findTwinPortal(_matrix, _matrix[i][j], {x: i, y: j});
          if (count >= 3){
            __matrix[i][j] = "&";//created black hole
            __matrix[twinPortal.x][twinPortal.y] = "&";//created black hole
          }
        }
        //remove
        if(_matrix[i][j] == "&"){
          let count = checkBlackHoleAroud(_matrix, i, j);
          if (count != 2 && count != 3)
            __matrix[i][j] = ".";//esting black hole
        }
        if(_matrix[i][j] == "?"){
          let count = checkBlackHoleAroud(_matrix, i, j);
          if (count != 2 && count != 3)
            __matrix[i][j] = "*";//esting black hole
        }
      }
    }
    return __matrix;
  }
  function checkBlackHoleAroud(_matrix, x, y){
    let count = 0;
    let maxR = _matrix.length;
    let maxC = _matrix[0].length;
    for(let i = x - 1; i <= x + 1; i++){
      for(let j = y - 1; j <= y + 1; j++){
        if(i == x && j == y) continue;
        if(i>=0 && j>=0 && i < maxR && j < maxC && (_matrix[i][j] == "&" || _matrix[i][j] == "?")){
          count++;
        }
      }
    }
    return count;
  }
  function findTwinPortal(_matrix, letter, avoid){
    for(let i = 0; i < _matrix.length; i++){
      for(let j = 0; j < _matrix[i].length; j++){
        if(_matrix[i][j] == letter && (i != avoid.x || j != avoid.y)){
          return {x: i, y: j};
        }
      }
    }
  }
  return self;
}