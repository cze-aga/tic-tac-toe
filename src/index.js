import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as helpers from './helpers';

/*The Square components are controlled components. 
The Board has full control over them. */
//class Square extends React.Component {
    /*In JavaScript classes, you need to always call super
     when defining the constructor of a subclass. All React
      component classes that have a constructor should start
       with a super(props) call.*/
    // constructor(props)
    // {
    //     super(props);
    //     this.state = {
    //         value: null,
    //     }
    // }

  //  render() {
  /*    return (
        <button 
            className="square"
            /*By calling this.setState from an onClick
             handler in the Square’s render method, we
              tell React to re-render that Square whenever
               its <button> is clicked. */
     /*       onClick = {() => this.props.onClick()}>
            {this.props.value}
        </button>
      );
    }
  }*/


function Square(props) {
    let markAsCurrent = props.markAsCurrent === true ? 'red' : 'black';
    return (
        <button className="square" 
        onClick = {props.onClick}
        style = {{color: markAsCurrent}}
        >
            {props.value}
        </button>
    );
}

  
  class Board extends React.Component {
    
    renderSquare(i) {
        var markAsCurrent =this.props.indexToPaint && 
             (i === this.props.indexToPaint.x * 3 + this.props.indexToPaint.y);
        if(this.props.winningCoordinates && this.props.winningCoordinates.includes(i))
        {
            markAsCurrent = true;
        }
        
        return <Square
        markAsCurrent = {markAsCurrent}
        value = {this.props.squares[i]} 
        onClick = {() => this.props.onClick(i)}/>;
       
    }
  
    render() {
        let boardSquares = [];

        for(let row = 0; row < 3; row ++)
        {
            let boardRow = [];
            for(let col = 0; col < 3; col++)
            {
                boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>);
            }
            boardSquares.push(<div key={row} className="board-row">{boardRow}</div>);
        }

        return (
            <div>
                {boardSquares}
            </div>
        );
    }
  }
  
  class Game extends React.Component {
   constructor(props){
       super(props);
       this.state = {
           history: [
            {
                squares: Array(9).fill(null),
                coordinates: Array(2).fill(null),
            }
           ],
           stepNumber: 0,
           xIsNext: true,
       }
   }
   

   jumpTo(step){
       this.setState(
           {
                stepNumber: step,
                xIsNext:(step%2) === 0,
           }
       );
   }


   sortList(){
       let reversedEnd = this.state.history.slice(1).reverse();
       let finalList = this.state.history.slice(0,1).concat(reversedEnd);
      
       this.setState(
        {
            history: finalList,
            stepNumber: finalList.length - 1,
        }
       );
   }

   handleClick(i){
    /*we call .slice() to create a copy of the squares
     array to modify instead of modifying the existing
     array
     There are generally two approaches to changing data.
     The first approach is to mutate the data by directly
     changing the data’s values. The second approach is 
     to replace the data with a new copy which has the 
     desired changes.
     
     var player = {score: 1, name: 'Jeff'};
     var newPlayer = Object.assign({}, player, {score: 2});
     Or if you are using object spread syntax proposal, you can write:
     var newPlayer = {...player, score: 2};
     */
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    const coordinates = helpers.getCoordinates(i);

    let winner = helpers.calculateWinner(squares);
    if(winner !== null || squares[i])
    {
        return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    let gameWithoutWinner = false;
    if(history.length === 9 && winner === null)
    {
        gameWithoutWinner = true;
    }

    this.setState({
        /*Unlike the array push() method you might be more
         familiar with, the concat() method doesn’t mutate 
         the original array, so we prefer it.
        */
        history: history.concat([
            {
                squares: squares,
                coordinates : 
                {
                    x: coordinates.x,
                    y: coordinates.y
                },
            }
        ]) ,
        xIsNext: gameWithoutWinner ? null : !this.state.xIsNext,
        stepNumber: history.length,
    });
}
   
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = helpers.calculateWinner(current.squares);
        let status;
        if(winner)
        {
            status = 'Winner ' + winner.winner + " (" +(winner.winningCoordinates[0] +
            " " + winner.winningCoordinates[1] +" "+ winner.winningCoordinates[2]) + ")";
        }
        else
        {
            status = 
            this.state.xIsNext === null ? 'Game without the winner' :
                ('Next player: ' + (this.state.xIsNext ? 'X' : '0'));
        }

        //move is the index
        //each past move has a unique ID associated with it: 
        //it’s the sequential number of the move.
        const moves = history.map((step, move) => {
            const desc = move ? 
            'Goto move #' + move  + " (" + step.coordinates.x  + "," + step.coordinates.y + ")" :
            'Goto game start';

            return(
                <li key={move}>
                    <button onClick ={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );


        });

        var indexToPaint = this.state.xIsNext === null ? null : current.coordinates;

        return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares= {current.squares}
                indexToPaint = {indexToPaint}
                winningCoordinates = {winner?.winningCoordinates}
                onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <div className="game-info">
            <button onClick={() => this.sortList()}>Sort list</button>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  