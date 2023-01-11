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
var player;
var turn;
var circleTurn = false
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
window.onload = function() {
    socket.emit('join', roomName);
    restart()
    document.querySelectorAll('[data]').forEach((sec) => {
        sec.classList.add('wait');
    });
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
socket.on('sec', (sec, cla) => {
    var data = document.querySelectorAll('[data' + sec + ']');
    if (cla === 't') {
        document.getElementById(sec).classList.add(cla);
    } else {
        data.forEach((c) => {
            if(c.className.includes('cell')) c.className = 'cell'
            if(!c.className.includes('section') && !c.className.includes('cell')) {
                var d = document.querySelectorAll('[data' + c.id.toString() + ']');
                c.className = 'sec';
                d.forEach(cell => {
                    cell.className = 'cell'
                })
            }
        });
        document.getElementById(sec).classList.add(cla);
    }
    checksection(cla);
    checkcelltie()
});
socket.on('secs', (sec, cla) => {
    var data = document.querySelectorAll('[data' + sec + ']');
    if (cla === 't') {
        document.getElementById(sec).classList.add(cla);
    } else {
        data.forEach((c) => {
            c.className = 'sec';
            var d = document.querySelectorAll('[data' + c.id.toString() + ']');
            d.forEach(cell => {
                cell.className = 'cell'
            })
        });
        document.getElementById(sec).classList.add(cla);
    }
    if (checkwin(cla)) {
        document.querySelectorAll('[data]').forEach((cell) => {
            cell.classList.add('wait');
        });
        winningMessageTextElement.innerText = `${cla.toUpperCase()}'s Wins!`;
        winningMessageElement.classList.add('show');
    } else if (isDraw() === true) {
        document.querySelectorAll('[data]').forEach((cell) => {
            cell.classList.add('wait');
        });
        winningMessageTextElement.innerText = 'Draw!';
        winningMessageElement.classList.add('show');
    }
});
socket.on('moved', (pos, cla, who) => {
    if (turn === 'o' && who === 'o') {
        document.querySelectorAll('[data]').forEach((sec) => {
            if (sec.classList.contains('x') || sec.classList.contains('o') || sec.classList.contains('t')) return;
            sec.className = 'section';
        });
        player.innerText = ` Your Turn `;
    } else if (turn === 'x' && who === 'x') {
        document.querySelectorAll('[data]').forEach((sec) => {
            if (sec.classList.contains('x') || sec.classList.contains('o') || sec.classList.contains('t')) return;
            sec.className = 'section';
        });
        player.innerText = ` Your Turn `;
    } else {
        document.querySelectorAll('[data]').forEach((sec) => {
            if (sec.classList.contains('x') || sec.classList.contains('o') || sec.classList.contains('t')) return;
            sec.className = 'section wait';
        });
        player.innerText = ` ${who.toUpperCase()}'s Turn `;
    }
    var sec = pos.charAt(0);
    sec += pos.charAt(1);
    if (document.getElementById(sec).className.includes('x') || document.getElementById(sec).className === 'section o') return;
    document.getElementById(pos).classList.add(cla);
    checksec(cla);
    checksectie();
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
function restart() {
    board();
    if (roomName != '') {
        player = document.getElementById('player');
    } else {
        location.href = '/';
    }
}
function board() {
    winningMessageTextElement.innerText = '';
    winningMessageElement.classList.remove('show');
    document.getElementById('board').innerHTML = ''
    for(i = 1; i < 10; i++) {
        if(i===1){var s='tl'}else if(i===2){var s='tm'}else if(i===3){var s='tr'}else if(i===4){var s='ml'}else if(i===5){var s='mm'}else if(i===6){var s='mr'}else if(i===7){var s='bl'}else if(i===8){var s='bm'}else{var s='br'}
        var section = document.createElement('div')
        section.id = s
        section.className = 'section'
        section.setAttribute('data', '')
        document.getElementById('board').appendChild(section)
        for(o = 1; o < 10; o++) {
            if(o===1){var se='tl'}else if(o===2){var se='tm'}else if(o===3){var se='tr'}else if(o===4){var se='ml'}else if(o===5){var se='mm'}else if(o===6){var se='mr'}else if(o===7){var se='bl'}else if(o===8){var se='bm'}else{var se='br'}
            var sect = document.createElement('div')
            sect.id = s + se
            sect.className = 'sec'
            sect.setAttribute('data' + s, '')
            section.appendChild(sect)
            for(p = 1; p < 10; p++) {
                if(p===1){var sec='tl'}else if(p===2){var sec='tm'}else if(p===3){var sec='tr'}else if(p===4){var sec='ml'}else if(p===5){var sec='mm'}else if(p===6){var sec='mr'}else if(p===7){var sec='bl'}else if(p===8){var sec='bm'}else{var sec='br'}
                var cell = document.createElement('div')
                cell.id = s + se + sec
                cell.className = 'cell'
                cell.setAttribute("onClick", `action('${s}', '${se}', '${sec}');`);
                cell.setAttribute('data' + s + se,'')
                sect.appendChild(cell)
            }
        }
    }
}
function action(s, ss, sss) {
    var id = document.getElementById(s + ss + sss);
    var sec = document.getElementById(s + ss);
    var sections = document.getElementById(s);
    if (id.className != 'cell' || sec.className != 'sec' || sections.className != 'section') return;
    socket.emit('move', roomName, s + ss + sss, turn);
    document.querySelectorAll('[data]').forEach((cell) => {
        if (cell.className.includes('x') || cell.classList.contains('o')) return;
        cell.classList.add('wait');
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
function checksec(currentClass) {
    document.querySelectorAll('[data]').forEach((sec) => {
        if (sec.className === 'section') {
            var data = document.querySelectorAll('[data' + sec.id.toString() + ']');
            data.forEach((cell) => {
            if (cell.className === 'sec') {
                WINNING_COMBINATIONS.some((combination) => {
                    var d = document.querySelectorAll('[data' + cell.id.toString() + ']');
                    var a = combination.every((index) => {
                        return d[index].classList.contains(currentClass);
                    });
                    if (a === true) {
                        socket.emit('section', roomName, cell.id, currentClass);
                    }
                })
            }
        });
      }
    });
}
function checksection(currentClass) {
    document.querySelectorAll('[data]').forEach((sec) => {
      if (sec.className === 'section') {
        var d = document.querySelectorAll('[data' + sec.id.toString() + ']')
        WINNING_COMBINATIONS.some((combination) => {
            var a = combination.every((index) => {
                return d[index].classList.contains(currentClass);
            });
            if (a === true) {
                socket.emit('sections', roomName, sec.id, currentClass);
            }
        });
      }
    });
}
function checksectie() {
    document.querySelectorAll('[data]').forEach((sec) => {
        if (sec.className === 'section') {
            var s = document.querySelectorAll('[data' + sec.id.toString() + ']');
            var b = [...s].every((cell) => {
                return (cell.className.includes(X_CLASS) || cell.className.includes(CIRCLE_CLASS));
            });
            if (b) socket.emit('section', roomName, sec.id, 't');
        }
    })
}
function checkcelltie() {
    document.querySelectorAll('[data]').forEach((sec) => {
        if (sec.className === 'section') {
            var data = document.querySelectorAll('[data' + sec.id.toString() + ']');
            data.forEach((a) => {
                if (a.className === 'sec') {
                    var s = document.querySelectorAll('[data' + a.id.toString() + ']');
                    var b = [...s].every((cell) => {
                        return (cell.className.includes(X_CLASS) || cell.className.includes(CIRCLE_CLASS));
                    });
                    if (b) socket.emit('section', roomName, a.id, 't');
                }
            });
        }
    })
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
            return document.querySelectorAll('[data]')[index].classList.contains(currentClass);
      });
    });
}
function rematch() {
  socket.emit('rematch', roomName);
}