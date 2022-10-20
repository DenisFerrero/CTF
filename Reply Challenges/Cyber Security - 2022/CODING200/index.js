const fs = require('fs');

const { mapFile, values } = require('./src/config');
const step = require('./src/step');

console.time('Process');
// 1. Process the map from the file

const matrix = fs
  .readFileSync(mapFile, 'utf8') // Read the map file
  .split('\r') // Split the file into lines
  .map(line => line.split('').filter(line => line !== '\n')); // Split each line into an array of characters

// Remove the last line if it's empty
if (matrix.at(-1).length === 0)
  matrix.pop();

// 2. Find the player and the target

const player = matrix.reduce((acc, row, x) => {
  // Skip search if the player is already found
  if (acc) return acc;
  // Find the player
  const y = row.indexOf(values.player);
  // If the player is found, return the coordinates
  if (y !== -1) return { x, y };
  // Otherwise return null
  return null;
}, null);

const target = matrix.reduce((acc, row, x) => {
  // Skip search if the target is already found
  if (acc) return acc;
  // Find the target
  const y = row.indexOf(values.target);
  // If the target is found, return the coordinates
  if (y !== -1) return { x, y };
  // Otherwise return null
  return null;
}, null);

// Convert target to tile as it also can be converted to a black hole
matrix[target.x][target.y] = values.tile;

// Exit the process if the player is not found
if (!player.x && !player.y) process.exit(-1);

/**
 * 3. Create the walkOver matrix
 * 
 * This matrix will be used to check if the player has already walked over a cell and keep clear the original map
 * 
 */
const walkOverMatrix = Array
  .from({ length: matrix.length }, () => Array.from({ length: matrix[0].length }, () => false));
// Mark the user position as visited
walkOverMatrix[player.x][player.y] = true;

// 4. Process the paths

const paths = step(matrix, walkOverMatrix, player, target);

console.timeEnd('Process');

// 5. Print the paths found
console.table(paths);

// 6. Get the path with the few steps and high number of portals
const shortest = paths
  .filter(path => 
    path.path.length === Math.min(...paths.map(path => path.path.length)) &&
    path.portalUsed === Math.max(...paths.map(path => path.portalUsed))
  )
  .sort((a, b) => a.path.localeCompare(b.path));

const shortestCount = shortest.length;

console.log(`Password: ${shortestCount}-${shortest.map(({ path }) => path).join('')}-${shortest[0]?.portalUsed}`);
