module.exports = {
  // Regex to match the different cells
  char: {
    blackHole: /^\&$/,
    tile: /^\.$/,
    portal: /^[a-z]$/
  },
  // Values in the map
  values: {
    blackHole: '&',
    tile: '.',
    player: 'A',
    target: 'B'
  },
  // Available moves
  directions: [
    { x: -1, y: 0,  char: 'N' },
    { x: 0,  y: 1,  char: 'E' },
    { x: 1,  y: 0,  char: 'S' },
    { x: 0, y: -1,  char: 'W' }
  ],
  // The map filename
  mapFile: 'map.txt',
}