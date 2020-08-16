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
    return (
        <button className="square" 
        onClick = {props.onClick}>
            {props.value}
        </button>
    );
}

  
  class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        }
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
        const modifySquares = this.state.squares.slice();

        if(helpers.calculateWinner(modifySquares) || modifySquares[i])
        {
            return;
        }
        
        modifySquares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: modifySquares,
            xIsNext: !this.state.xIsNext,    
        });
    }


    renderSquare(i) {
      return <Square 
      value = {this.state.squares[i]}
      onClick = {() => this.handleClick(i)}/>;
    }
  
    render() {
        const winner = helpers.calculateWinner(this.state.squares);
        let status;
        if(winner)
        {
            status = 'Winner: ' + winner;
        }
        else
        {
            status = 'Next player: ' + 
            (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
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
  