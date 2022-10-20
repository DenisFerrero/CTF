const { char, directions, values } = require('./config');
const { checkAround, getPortal } = require('./checkAround');
const { blackHoleConversion, upcomingValue } = require('./blackHoleConversion');

/**
 * Move around the map
 *  
 * @param {string[][]} _matrix - Current map
 * @param {string[][]} _walkOverMatrix - Matrix of the already visited cells
 * @param {number} x - Current x coordinate 
 * @param {number} y - Current y coordinate
 * @returns {object[]} - All the paths visited 
 */

function step (_matrix, _walkOverMatrix, player, target, msg = '') {
  const { x, y } = player;
  const matrix = JSON.parse(JSON.stringify(_matrix));
  const walkOverMatrix = JSON.parse(JSON.stringify(_walkOverMatrix));
  const paths = [];
  // Get all the cells already visited
  const walkOver = checkAround(walkOverMatrix, x, y);
  // Unavailable cells to move to due to the black hole presence, prevent direction duplication using Set
  const upcomingBlackHoles = [...new Set(directions // Get all the upcoming black holes
    .reduce((acc, { x: dx, y: dy, char: dChar }) => {
      const cell = matrix[x + dx] && matrix[x + dx][y + dy];
      // If the direction is not available mark it as a black hole, or if it's a black hole add the direction
      if (!cell || char.blackHole.test(cell)) acc.push(dChar);
      // In the other case check tile situation and portal ones (portal needs a double check)
      else {
        // In case of a tile and the upcoming value is a black hole, mark it as a black hole
        if (char.tile.test(cell) && char.blackHole.test(upcomingValue(matrix, x + dx, y + dy)))
          acc.push(dChar);
        else if (char.portal.test(cell)) {
          // In case of a portal, check both portal sides
          const portalOpposite = getPortal(matrix, x + dx, y + dy);
          // If the portal is not available mark it as a black hole
          if (!portalOpposite) acc.push(dChar);
          else {
            const [portalOppositeX, portalOppositeY] = portalOpposite;
            // If the other portal side is going to be a black hole mark it as a black hole
            if (char.blackHole.test(upcomingValue(matrix, portalOppositeX, portalOppositeY)))
              acc.push(dChar);
          }
        }
      }
      return acc;
    }, []))];
  // Check the available cells to move to
  const availableDirections = [];
  for (const direction of directions) {
    const dx = x + direction.x,
          dy = y + direction.y;
    // Exclude already visited cells (add 1 to check in the right direction as you start from the center of the matrix)
    if (walkOver[direction.x + 1] && walkOver[direction.x + 1][direction.y + 1]) continue;
    // The below 2 conditions (empty cell, black hole presence) are not needed, but you never know XD
    // Exclude unavailable cells
    const cell = matrix[dx] && matrix[dx][dy];
    if (!cell) continue;
    // Exclude black holes
    if (char.blackHole.test(cell)) continue;
    // Exclude upcoming black holes
    if (upcomingBlackHoles.includes(direction.char)) continue;
    // The cell is available
    availableDirections.push(direction);
  }
  // In case of a dead end, return an empty paths list
  if (availableDirections.length === 0) return paths;
  // Check all direction possibilities
  for (const direction of availableDirections) {
    let sessionMatrix = JSON.parse(JSON.stringify(matrix)),
        sessionWalkOverMatrix = JSON.parse(JSON.stringify(walkOverMatrix)),
        dx = x + direction.x,
        dy = y + direction.y;
    const nextCellValue = sessionMatrix[dx][dy];
    let throughPortal = false;
    // Mark the next cell as visited
    sessionWalkOverMatrix[dx][dy] = true;
    // Move to the next cell
    sessionMatrix[x][y] = values.tile;
    // Check if the cell is a portal
    if (char.portal.test(nextCellValue)) {
      // Get the other portal side
      const portalOpposite = getPortal(sessionMatrix, dx, dy);
      // If the other portal side is not available, continue, the path is not valid
      if (!portalOpposite) continue;
      const [portalOppositeX, portalOppositeY] = portalOpposite;
      // Mark the other portal side as visited
      sessionWalkOverMatrix[portalOppositeX][portalOppositeY] = true;
      // Move to the other portal side and "empty" the current one as it cannot be visited anymore
      sessionMatrix[dx][dy] = values.tile; 
      sessionMatrix[portalOppositeX][portalOppositeY] = values.player;
      // Update the coordinates
      dx = portalOppositeX;
      dy = portalOppositeY;
      // Mark the portal passage
      throughPortal = true;
    // In case of a tile just move the player to that cell
    } else {
      sessionMatrix[dx][dy] = values.player;
    }
    // Breaking point: Arrived to the target! Close the recursion
    if (dx === target.x && dy === target.y) {
      // Add the current move as it's the last one, set portalUsed to 0 as you just move by one cell
      paths.push({ path: direction.char, portalUsed: 0 });
      continue;
    }
    // Update the block hole presences
    sessionMatrix = blackHoleConversion(sessionMatrix, dx, dy);
    // Recursion to get all the sub paths
    const subPaths = step(sessionMatrix, sessionWalkOverMatrix, { x: dx, y: dy }, target, `${msg}${direction.char}`);
    // If there are any subpaths, add them to the current step
    for (const subPath of subPaths) {
      // Push all the subPath + the current direction, and count the portal passage
      paths.push({ path: direction.char + subPath.path, portalUsed: subPath.portalUsed + Number(throughPortal) });
    }
  }
  // Return the path gathered
  return paths;
}

module.exports = step;