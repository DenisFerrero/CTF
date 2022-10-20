const fs = require('fs');

const { mapFile, directions } = require('./src/config');
const { stepFunction }  = require('./src/step');
const step = new stepFunction();
// 1. Process the map from the file

const matrix = fs
  .readFileSync(mapFile, 'utf8') // Read the map file
  .split('\r') // Split the file into lines
  .map(line => line.split('').filter(line => line !== '\n')); // Split each line into an array of characters

// Remove the last line if it's empty
  matrix.pop();

// 2. Find the player

let player = {  };
for (const x in matrix) {
  const y = matrix[x].indexOf('A');
  if (y !== -1) {
    player = { x: Number(x), y: Number(y) };
    break;
  }
}
let finalPosition = {  };
for (const x in matrix) {
  const y = matrix[x].indexOf('B');
  if (y !== -1) {
    matrix[x][y] = '.';
    finalPosition = { x: Number(x), y: Number(y) };
    break;
  }
}

/**
 * 3. Create the walkOver matrix
 * 
 * This matrix will be used to check if the player has already walked over a cell and keep clear the original map
 * 
 */

const walkOverMatrix = Array
  .from({ length: matrix.length }, () => Array.from({ length: matrix[0].length }, () => false));
// Mark the player position as true
walkOverMatrix[player.x][player.y] = true;

// 4. Process the paths

//const paths = step(matrix, walkOverMatrix, player.x, player.y);
let direction = directions[0];//primo passo

for(let i=0; i<4; i++){
  let _direction = directions[i];
  let initialSolution = [];
  let _matrix = JSON.parse(JSON.stringify(matrix));
  step.step2(_matrix, {...player}, _direction, initialSolution, 0, finalPosition);
}
let maxPortalUsed = Math.max(...step.solutions.map(o => o.portalUsed));
let finalSolutions = step.solutions.filter((e)=> e.portalUsed == maxPortalUsed);
let password = "";
password += finalSolutions.length+"-";
for(let i=0; i<finalSolutions.length; i++){
  password  += finalSolutions[i].directions.join('');
  console.log(i,finalSolutions[i].directions, finalSolutions[i].portalUsed);
}
password += "-"+maxPortalUsed;
console.log("password", password);

// TODO Evaluate which path is the best (this should be the easiest part)
