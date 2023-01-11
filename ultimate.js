var socket = io();
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
const divtl = document.getElementById('tl');
const divtm = document.getElementById('tm');
const divtr = document.getElementById('tr');
const divml = document.getElementById('ml');
const divmm = document.getElementById('mm');
const divmr = document.getElementById('mr');
const divbl = document.getElementById('bl');
const divbm = document.getElementById('bm');
const divbr = document.getElementById('br');
const tl = document.querySelectorAll('[data-celltl]');
const tm = document.querySelectorAll('[data-celltm]');
const tr = document.querySelectorAll('[data-celltr]');
const ml = document.querySelectorAll('[data-cellml]');
const mm = document.querySelectorAll('[data-cellmm]');
const mr = document.querySelectorAll('[data-cellmr]');
const bl = document.querySelectorAll('[data-cellbl]');
const bm = document.querySelectorAll('[data-cellbm]');
const br = document.querySelectorAll('[data-cellbr]');
const section = document.querySelectorAll('[cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
var player;
var circleTurn;
var turn;
window.onload = function () {
  if (roomName != '') {
    player = document.getElementById('player');
  } else {
    location.href = '/';
  }
  socket.emit('join', roomName);
  section.forEach((sec) => {
    var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
    a.forEach((cell) => {
      cell.classList.add('wait');
    });
  });
};
socket.on('board', (player) => {
  if (player === 'x') {
    circleTurn = false;
    turn = 'x';
  } else {
    circleTurn = true;
    turn = 'o';
  }
  setBoardHoverClass();
});
socket.on('start', (x) => {
  if (turn === 'x') {
    player.innerText = ` Your Turn `;
    section.forEach((sec) => {
      var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
      a.forEach((cell) => {
        cell.className = 'cell';
      });
    });
  } else {
    player.innerText = ` X's Turn `;
  }
});
socket.on('sec', (sec, cla) => {
  var data = document.querySelectorAll('[data-cell' + sec + ']');
  if (cla === 't') {
    document.getElementById(sec).className = 'first ' + cla;
  } else {
    data.forEach((c) => {
      c.className = 'cell';
    });
    document.getElementById(sec).className = 'first ' + cla;
  }
  if (checkwin(cla)) {
    section.forEach((cell) => {
      cell.classList.add('wait');
    });
    winningMessageTextElement.innerText = `${cla.toUpperCase()}'s Wins!`;
    winningMessageElement.classList.add('show');
  } else if (isDraw()) {
    section.forEach((cell) => {
      cell.classList.add('wait');
    });
    winningMessageTextElement.innerText = 'Draw!';
    winningMessageElement.classList.add('show');
  }
});
socket.on('moved', (pos, cla, who) => {
  if (who === 'o') {
    var a = 'x';
  } else {
    var a = 'o';
  }
  if (turn === 'o' && who === 'o') {
    section.forEach((sec) => {
      var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
      a.forEach((cell) => {
        if (cell.className.includes('x') || cell.className.includes('o'))
          return;
        cell.className = 'cell';
      });
    });
    player.innerText = ` Your Turn `;
  } else if (turn === 'x' && who === 'x') {
    section.forEach((sec) => {
      var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
      a.forEach((cell) => {
        if (cell.className.includes('x') || cell.className.includes('o'))
          return;
        cell.className = 'cell';
      });
    });
    player.innerText = ` Your Turn `;
  } else {
    section.forEach((sec) => {
      var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
      a.forEach((cell) => {
        if (cell.className.includes('x') || cell.className.includes('o'))
          return;
        cell.className = 'cell wait';
      });
    });
    player.innerText = ` ${who.toUpperCase()}'s Turn `;
  }
  var sec = pos.charAt(0);
  sec += pos.charAt(1);
  if (document.getElementById(sec).className != 'first') return;
  document.getElementById(pos).className = 'cell ' + cla;
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
    section.forEach((sec) => {
      sec.className = 'first';
      var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
      a.forEach((b) => {
        b.className = 'cell';
      });
    });
    winningMessageElement.classList.remove('show');
    setBoardHoverClass();
  }
});
function rematch() {
  socket.emit('rematch', roomName);
}
function action(s, c) {
  var id = document.getElementById(s + c);
  var sec = document.getElementById(s);
  var currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  if (id.className != 'cell') return;
  if (sec.className != 'first') return;
  socket.emit('move', roomName, s + c, turn);
  id.className = 'cell ' + currentClass;
  checksec(currentClass);
  checktie();
  section.forEach((sec) => {
    var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
    a.forEach((cell) => {
      if (cell.className.includes('x') || cell.className.includes('o')) return;
      cell.classList.add('wait');
    });
  });
}
function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}
function isDraw() {
  return [...section].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) ||
      cell.classList.contains(CIRCLE_CLASS) ||
      cell.classList.contains('t')
    );
  });
}
function checkwin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return section[index].classList.contains(currentClass);
    });
  });
}
function checktie() {
  section.forEach((sec) => {
    var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
    var b = [...a].every((cell) => {
      return (
        cell.className.includes(X_CLASS) ||
        cell.className.includes(CIRCLE_CLASS)
      );
    });
    if (b) socket.emit('section', roomName, sec.id, 't');
  });
}
function checksec(currentClass) {
  section.forEach((sec) => {
    if (sec.className === 'first') {
      WINNING_COMBINATIONS.some((combination) => {
        var data = document.querySelectorAll(
          '[data-cell' + sec.id.toString() + ']'
        );
        var a = combination.every((index) => {
          return data[index].classList.contains(currentClass);
        });
        if (a === true) {
          socket.emit('section', roomName, sec.id, currentClass);
        }
      });
    }
  });
}
