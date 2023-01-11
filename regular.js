var socket = new io()
const X_CLASS = 'x';
const CIRCLE_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
var circleTurn = false;
var turn;
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
window.onload = restart()
function restart() {
    board()
    socket.emit('join', roomName);
    document.querySelectorAll('[data]').forEach((sec) => {
        sec.classList.add('wait');
    });
}
function board() {
    winningMessageTextElement.innerText = '';
    winningMessageElement.classList.remove('show');
    document.getElementById('board').innerHTML = ''
    for(i = 1; i < 10; i++) {
        if(i===1){var s='tl'}else if(i===2){var s='tm'}else if(i===3){var s='tr'}else if(i===4){var s='ml'}else if(i===5){var s='mm'}else if(i===6){var s='mr'}else if(i===7){var s='bl'}else if(i===8){var s='bm'}else{var s='br'}
        var cell = document.createElement('div')
        cell.id = s
        cell.className = 'cell'
        cell.setAttribute("onClick", `action('${s}');`);
        cell.setAttribute('data', '')
        document.getElementById('board').appendChild(cell)
    }
}
socket.on('board', (player) => {
    if (player === 'x') {
      circleTurn = false;
      turn = 'x';
    } else {
      circleTurn = true;
      turn = 'o';
    }
  });
socket.on('start', (x) => {
    setBoardHoverClass();
    if (turn === 'x') {
      player.innerText = ` Your Turn `;
      document.querySelectorAll('[data]').forEach((sec) => {
          sec.classList.remove('wait')
      });
    } else {
      player.innerText = ` X's Turn `;
    }
});
socket.on('moved', (pos, cla, who) => {
    if (turn === 'o' && who === 'o') {
        document.querySelectorAll('[data]').forEach((sec) => {
            if (sec.classList.contains('x') || sec.classList.contains('o') || sec.classList.contains('t')) return;
            sec.className = 'cell';
        });
        player.innerText = ` Your Turn `;
    } else if (turn === 'x' && who === 'x') {
        document.querySelectorAll('[data]').forEach((sec) => {
            if (sec.classList.contains('x') || sec.classList.contains('o') || sec.classList.contains('t')) return;
            sec.className = 'cell';
        });
        player.innerText = ` Your Turn `;
    } else {
        document.querySelectorAll('[data]').forEach((sec) => {
            if (sec.classList.contains('x') || sec.classList.contains('o') || sec.classList.contains('t')) return;
            sec.className = 'cell wait';
        });
        player.innerText = ` ${who.toUpperCase()}'s Turn `;
    }
    document.getElementById(pos).classList.add(cla);
    var section = document.querySelectorAll('[data]')
    if (checkwin(cla)) {
        section.forEach((cell) => {
            cell.classList.add('wait');
        });
        winningMessageTextElement.innerText = `${cla.toUpperCase()}'s Wins!`;
        winningMessageElement.classList.add('show');
    } else if (isDraw() === true) {
        section.forEach((cell) => {
            cell.classList.add('wait');
        });
        winningMessageTextElement.innerText = 'Draw!';
        winningMessageElement.classList.add('show');
    }
});
socket.on('request', (a) => {
    var b = confirm('Opponet wants to rematch');
    socket.emit('response', roomName, b);
    if (b === false) {
      location.href = '/';
    }
  });
socket.on('rematch', (res) => {
    if (res === false) {
        alert('Opponent Denied, Sending to home page in 5 seconds');
        setTimeout(() => {
            location.href = '/';
        }, 5000);
    } else {
        if (turn === 'x') {
            circleTurn = true;
            turn = 'o';
        } else {
            circleTurn = false;
            turn = 'x';
        }
        restart()
        winningMessageElement.classList.remove('show');
        setBoardHoverClass();
    }
});
function rematch() {
    socket.emit('rematch', roomName);
}
function action(s) {
    var cell = document.getElementById(s);
    if (cell.className != 'cell') return;
    if (circleTurn === true) {
      var b = 'o';
    } else {
      var b = 'x';
    }
    socket.emit('move', roomName, s, b);
}
function isDraw() {
    var a = document.querySelectorAll('[data]')
    return [...a].every((cell) => {
        return (cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS) || cell.classList.contains('t'));
    });
}
function checkwin(currentClass) {
    return WINNING_COMBINATIONS.some((combination) => {
        return combination.every((index) => {
            var a = document.querySelectorAll('[data]')
            return a[index].classList.contains(currentClass);
      });
    });
}
function setBoardHoverClass() {
    var board = document.getElementById('board')
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
      board.classList.add(CIRCLE_CLASS);
    } else {
      board.classList.add(X_CLASS);
    }
}