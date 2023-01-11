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
const winningMessageTextElement = document.querySelector(
  '[data-winning-message-text]'
);
let circleTurn = false;
setBoardHoverClass();
function restart() {
  section.forEach((sec) => {
    sec.className = 'first';
    var a = document.querySelectorAll('[data-cell' + sec.id.toString() + ']');
    a.forEach((b) => {
      b.className = 'cell';
    });
  });
  circleTurn = false;
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}
function action(s, c) {
  var id = document.getElementById(s + c);
  var sec = document.getElementById(s);
  var currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  if (id.className != 'cell') return;
  if (sec.className != 'first') return;
  id.classList.add(currentClass);
  checksec(currentClass);
  checktie();
  if (checkwin(currentClass)) {
    section.forEach((cell) => {
      cell.classList.add('wait');
    });
    winningMessageTextElement.innerText = `${currentClass.toUpperCase()}'s Wins!`;
    winningMessageElement.classList.add('show');
  } else if (isDraw()) {
    section.forEach((cell) => {
      cell.classList.add('wait');
    });
    winningMessageTextElement.innerText = 'Draw!';
    winningMessageElement.classList.add('show');
  } else {
    circleTurn = !circleTurn;
    setBoardHoverClass();
  }
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
    if (b) document.getElementById(sec.id).classList.add('t');
  });
}
function checksec(currentClass) {
  if (divtl.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return tl[index].classList.contains(currentClass);
      });
      if (a === true) {
        tl.forEach((c) => {
          c.className = 'cell';
        });
        divtl.classList.add(currentClass);
      }
    });
  }
  if (divtm.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return tm[index].classList.contains(currentClass);
      });
      if (a === true) {
        tm.forEach((c) => {
          c.className = 'cell';
        });
        divtm.classList.add(currentClass);
      }
    });
  }
  if (divtr.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return tr[index].classList.contains(currentClass);
      });
      if (a === true) {
        tr.forEach((c) => {
          c.className = 'cell';
        });
        divtr.classList.add(currentClass);
      }
    });
  }
  if (divml.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return ml[index].classList.contains(currentClass);
      });
      if (a === true) {
        ml.forEach((c) => {
          c.className = 'cell';
        });
        divml.classList.add(currentClass);
      }
    });
  }
  if (divmm.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return mm[index].classList.contains(currentClass);
      });
      if (a === true) {
        mm.forEach((c) => {
          c.className = 'cell';
        });
        divmm.classList.add(currentClass);
      }
    });
  }
  if (divmr.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return mr[index].classList.contains(currentClass);
      });
      if (a === true) {
        mr.forEach((c) => {
          c.className = 'cell';
        });
        divmr.classList.add(currentClass);
      }
    });
  }
  if (divbl.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return bl[index].classList.contains(currentClass);
      });
      if (a === true) {
        bl.forEach((c) => {
          c.className = 'cell';
        });
        divbl.classList.add(currentClass);
      }
    });
  }
  if (divbm.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return bm[index].classList.contains(currentClass);
      });
      if (a === true) {
        bm.forEach((c) => {
          c.className = 'cell';
        });
        divbm.classList.add(currentClass);
      }
    });
  }
  if (divbr.className === 'first') {
    WINNING_COMBINATIONS.some((combination) => {
      var a = combination.every((index) => {
        return br[index].classList.contains(currentClass);
      });
      if (a === true) {
        br.forEach((c) => {
          c.className = 'cell';
        });
        divbr.classList.add(currentClass);
      }
    });
  }
}
