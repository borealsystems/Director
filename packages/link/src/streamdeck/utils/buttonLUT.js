// Yes I know this is stupid

const buttonLUT = {
  elgato: {
    mini: {
      forward: [
        [0, 1, 2],
        [3, 4, 5]
      ],
      reverse: [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 }
      ]
    }
  }
}

export default buttonLUT
