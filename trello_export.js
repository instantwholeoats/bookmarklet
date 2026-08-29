// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// ==/ClosureCompiler==

// compile:
// https://closure-compiler.appspot.com/

function trelloExport() {
  let text = '';
  const lists = document.getElementsByClassName('list');
  for (const list of lists) {
    const cards = list.querySelectorAll('span.js-card-name');
    for (let i = 0; i < cards.length; i++) {
      const number = cards[i].querySelector('span.trello-number');
      if (number != null) number.remove();
      text += cards[i].innerText + '\n';
      const label = document.createElement('span');
      label.className = 'trello-number';
      label.style.color = 'blue';
      label.append(`【No. ${i + 1}】`, document.createElement('br'));
      cards[i].prepend(label);
    }
    text += '=========================================\n\n'
  }
  const url = URL.createObjectURL(new Blob([text], {
    type: 'text/plain;charset=utf-8'
  }));
  const link = document.createElement('a');
  link.download = 'trello-cards.txt';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
trelloExport();
