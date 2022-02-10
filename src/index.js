import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * 函数组件
 */
function Square (props) {
  return (
    <button
      className='square'
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare (i) {
    var board = []
    for (let j = 0; j < 3; j++) {
      board.push(
        <Square
          key={i + j * 3}
          value={this.props.squares[i + j * 3]}
          onClick={() => this.props.onClick(i + j * 3)}
          style={this.props.style(i + j * 3)}
        />
      )
    }
    return board;
  }

  render () {
    var board = []
    for (let i = 0; i < 3; i++) {
      board.push(
        <div className='board-row' key={i}>
          {this.renderSquare(i)}
        </div>
      )
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: false,//排列方式，默认升序
      history: [{
        squares: Array(9).fill(null),
        coordinates: [1, 1],//坐标
      }],
      stepNumber: 0,//正在查看哪一项历史纪录
      xIsNext: true,//默认 '玩家X' 先手
    };
  }

  handleBoardClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]//使用最新一次历史记录来确定并展示游戏的状态
    const squares = current.squares.slice()//创建副本，不可变对象
    const raw = parseInt(i / 3) + 1
    const column = (i + 1) % 3 === 0 ? 3 : (i + 1) % 3
    if (calculateWinner(squares) || squares[i]) {
      //决出胜者 或 格子填满时不做处理
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'//更新玩家
    this.setState({
      history: history.concat([{
        squares: squares,
        coordinates: [raw, column],
      }]),//不会改变原数组
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,//切换玩家
    })
  }

  handleBoardStyle (winner, i) {
    const style = {
      background: 'yellow',
    }
    return winner && winner.indexOf(i) > -1 ? style : null
  }

  handleHistoryClick (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  handleOrderClick () {
    const order = this.state.order
    this.setState({
      order: !order,
    })
  }

  render () {
    const history = this.state.history
    const current = history[this.state.stepNumber]//使用最新一次历史记录来确定并展示游戏的状态
    const winner = calculateWinner(current.squares)//判断胜者玩家

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + '  (' + step.coordinates + ')' :
        'Go to game start'
      return (
        <li key={move}>
          <button
            className={
              (move === this.state.stepNumber) ?
                'history-highlight' :
                'history-normal'
            }//加粗显示当前选择的项目
            onClick={() => this.handleHistoryClick(move)}>
            {desc}
          </button>
        </li>
      );
    })

    if (this.state.order) {
      //改变排列方式
      moves.reverse()
    }

    let order = this.state.order ? 'Ascending' : 'Descending'
    let status
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]]
    } else if (this.state.stepNumber === 9) {
      //平局
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleBoardClick(i)}
            style={(i) => this.handleBoardStyle(winner, i)}//高亮赢家连续格子
          />
        </div>
        <div className='game-info'>
          <button onClick={() => this.handleOrderClick()}>
            {order}
          </button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i]
    }
  }
  return null
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
