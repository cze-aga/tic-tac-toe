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
        var markAsCurrent = i === this.props.indexToPaint.x * 3 + this.props.indexToPaint.y;
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
            boardRow.push(<span>{this.renderSquare((row * 3) + col)}</span>);
        }
        boardSquares.push(<div className="board-row">{boardRow}</div>);
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

    if(helpers.calculateWinner(squares) || squares[i])
    {
        return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';

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
        xIsNext: !this.state.xIsNext,
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
            status = 'Winner ' + winner;
        }
        else
        {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
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

        return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares= {current.squares}
                indexToPaint = {current.coordinates}
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
  