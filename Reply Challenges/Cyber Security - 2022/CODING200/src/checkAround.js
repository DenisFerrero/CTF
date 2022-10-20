const { char } = require('./config');

/**
 * Return the sub-matrix of the given matrix that is around the given point.
 * 
 * @function checkAround
 * @param {number[][]} matrix - The matrix to check
 * @param {number} x - The x coordinate of the cell
 * @param {number} y - The y coordinate of the cell
 * @returns {number[][]} The sub-matrix
 */
module.exports.checkAround = function (matrix, x, y) {
  return [
    [matrix[x - 1]?.[y - 1],  matrix[x - 1]?.[y],   matrix[x - 1]?.[y + 1]],
    [matrix[x]?.[y - 1],      matrix[x]?.[y],       matrix[x]?.[y + 1]],
    [matrix[x + 1]?.[y - 1],  matrix[x + 1]?.[y],   matrix[x + 1]?.[y + 1]]
  ];
}

/**
 * Return the coordinates of the portal that is on the other side of the given one
 * 
 * @function getPortal
 * @param {number[][]} _matrix - The matrix to check
 * @param {number} x - The x coordinate of the cell
 * @param {number} y - The y coordinate of the cell
 * @returns {number[]|boolean} The coordinates of the portal, or false if the given cell is not a portal
 */
module.exports.getPortal = function (_matrix, x, y) {
  const matrix = JSON.parse(JSON.stringify(_matrix));
  if (!char.portal.test(matrix[x][y])) return false;
  const portal = matrix[x][y];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      // Check that's the same portal and that it's not the same cell
      if (matrix[i][j] === portal && (i !== x || j !== y)) return [i, j];
    }
  }
  // Cannot find the other side of the portal
  return false;
}