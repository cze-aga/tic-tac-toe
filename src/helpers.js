/*
Given an array of 9 squares, this 
function will check for a winner an
d return 'X', 'O', or null as appropriate.
 */

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          winningCoordinates : [a,b,c],
        };
      }
    }
    return null;
  }


  function getCoordinates(i){
      var x = parseInt(i/3);
      var y = parseInt(i % 3);
      return {
        x: x,
        y: y
      };
  }

  export {calculateWinner, getCoordinates};