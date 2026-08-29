const assert = require('node:assert/strict')
const fs = require('node:fs')
const test = require('node:test')
const vm = require('node:vm')

class Element {
  constructor(tag, text = '') {
    this.tag = tag
    this.innerText = text
    this.className = ''
    this.style = {}
    this.children = []
    this.clicked = false
  }

  append(...children) { this.children.push(...children) }
  prepend(child) { this.children.unshift(child) }
  click() { this.clicked = true }
  querySelector(selector) {
    return this.children.find((child) => child.className === selector.slice(5)) ?? null
  }
  querySelectorAll() { return this.cards ?? [] }
  remove() { this.removed = true }
}

function contextFor(cards) {
  const list = new Element('div')
  list.cards = cards
  let downloaded
  let revoked
  const document = {
    createElement(tag) {
      const element = new Element(tag)
      if (tag === 'a') downloaded = element
      return element
    },
    getElementsByClassName() { return [list] }
  }
  return {
    context: vm.createContext({
      Blob,
      document,
      setInterval: () => 1,
      URL: {
        createObjectURL: () => 'blob:test',
        revokeObjectURL: (url) => { revoked = url }
      }
    }),
    downloaded: () => downloaded,
    revoked: () => revoked
  }
}

function run(file, context) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context)
}

test('number bookmarklet adds labels without HTML injection', () => {
  const cards = [new Element('span', '<b>one</b>'), new Element('span', 'two')]
  const fixture = contextFor(cards)
  run('trello_number.js', fixture.context)
  assert.equal(cards[0].children[0].className, 'trello-number')
  assert.equal(cards[0].children[0].children[0], '【No. 1】')
  assert.equal(cards[1].children[0].children[0], '【No. 2】')
})

test('export bookmarklet downloads text and revokes its object URL', () => {
  const fixture = contextFor([new Element('span', 'one')])
  run('trello_export.js', fixture.context)
  assert.equal(fixture.downloaded().download, 'trello-cards.txt')
  assert.equal(fixture.downloaded().href, 'blob:test')
  assert.equal(fixture.downloaded().clicked, true)
  assert.equal(fixture.revoked(), 'blob:test')
})
