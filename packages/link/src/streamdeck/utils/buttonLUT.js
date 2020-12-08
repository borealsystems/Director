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
    },
    original: {
      forward: [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14]
      ],
      reverse: [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 0, column: 3 },
        { row: 0, column: 4 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 1, column: 3 },
        { row: 1, column: 4 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
        { row: 2, column: 3 },
        { row: 2, column: 4 }
      ]
    },
    xl: {
      forward: [
        [0, 1, 2, 3, 4, 5, 6, 7],
        [8, 9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29, 30, 31]
      ],
      reverse: [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 0, column: 3 },
        { row: 0, column: 4 },
        { row: 0, column: 5 },
        { row: 0, column: 6 },
        { row: 0, column: 7 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 1, column: 3 },
        { row: 1, column: 4 },
        { row: 1, column: 5 },
        { row: 1, column: 6 },
        { row: 1, column: 7 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
        { row: 2, column: 3 },
        { row: 2, column: 4 },
        { row: 2, column: 5 },
        { row: 2, column: 6 },
        { row: 2, column: 7 },
        { row: 3, column: 0 },
        { row: 3, column: 1 },
        { row: 3, column: 2 },
        { row: 3, column: 3 },
        { row: 3, column: 4 },
        { row: 3, column: 5 },
        { row: 3, column: 6 },
        { row: 3, column: 7 }
      ]
    }
  }
}

export default buttonLUT
