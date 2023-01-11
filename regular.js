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
var circleTurn = false
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
window.onload = restart()
function restart() {
    board();
    circleTurn = false;
    setBoardHoverClass();
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
function action(s) {
    var section = document.querySelectorAll('[data]')
    var cell = document.getElementById(s);
    var currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    if (cell.className != 'cell') return;
    cell.classList.add(currentClass);
    if (checkwin(currentClass)) {
        section.forEach((cell) => {
            cell.classList.add('wait');
        });
        winningMessageTextElement.innerText = `${currentClass.toUpperCase()}'s Wins!`;
        winningMessageElement.classList.add('show');
    } else if (isDraw() === true) {
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