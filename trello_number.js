// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// ==/ClosureCompiler==

// compile:
// https://closure-compiler.appspot.com/

function trelloNumber(){
  const lists = document.getElementsByClassName('list');
  for (const list of lists) {
    const cards = list.querySelectorAll('span.js-card-name');
    for (let i = 0; i < cards.length; i++) {
      const number = cards[i].querySelector('span.trello-number');
      if (number != null) number.remove();
      const label = document.createElement('span');
      label.className = 'trello-number';
      label.style.color = 'blue';
      label.append(`【No. ${i + 1}】`, document.createElement('br'));
      cards[i].prepend(label);
    }
  }
}
trelloNumber();
const trelloNumberTimer = setInterval(trelloNumber, 3000);
