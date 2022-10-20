const { char, values } = require('./config');
const { checkAround, getPortal } = require('./checkAround');

/**
 * Convert target value of the matrix to black hole or tile
 * 
 * @param {string[][]} matrix - The matrix 
 * @param {number} x - The X coordinate of the cell 
 * @param {number} y - The Y coordinate of the cell
 * @returns {string} The new value of the cell
 */
const upcomingValue = function (matrix, x, y) {
  let value = JSON.parse(JSON.stringify(matrix[x][y]));
  // Get the matrix around the current cell
  const around = checkAround(matrix, x, y);
  // Count the number of black holes around the current cell
  const blackHoleCount = around.reduce((acc, row) => {
    return acc + row.filter(cell => char.blackHole.test(cell)).length;
  }, 0);
  // If there are 3 or more black holes around the current cell and the current cell value is a tile or a portal, convert the current cell into a black hole
  if ([char.portal, char.tile].some(rgx => rgx.test(value)) &&  blackHoleCount >= 3) {
    value = values.blackHole;
  // If there are not 2 or 3 black holes around the current cell and the current cell value is a black hole, convert the current cell into a tile
  // Remove 1 from the black hole count because the current cell is a black hole
  } else if (char.blackHole.test(value) && ![2, 3].includes(blackHoleCount - 1)) {
    value = values.tile;
  }
  return value;
}

/**
 * Convert tiles into black holes and vice versa
 * 
 * @function blackHoleConversion
 * @param {string[][]} _matrix - The matrix to convert
 * @returns {string[][]} - The converted matrix
 */
module.exports.blackHoleConversion = function(_matrix) {
  // Clone the matrix
  const matrix = JSON.parse(JSON.stringify(_matrix));
  // Convert tiles/portals into black holes and vice versa
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      // Use _matrix as it's the original matrix
      matrix[x][y] = upcomingValue(_matrix, x, y);
    }
  }
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      // Convert "open" portals into black holes, open portals are portals that are not connected to another portal
      if (char.portal.test(matrix[x][y]) && getPortal(matrix, x, y) === false) {
        matrix[x][y] = values.blackHole;
      }
    }
  }
  return matrix;
}

module.exports.upcomingValue = upcomingValue;