let gameData = [
  ['aa', 'ab', 'ac', 'ad'],
  ['ba', 'bb', 'bc', 'bd'],
  ['ca', 'cb', 'cc', 'cd'],
  ['da', 'db', 'dc', 'dd']
]
let buttons = {
  aa: 0, ab: 0, ac: 0, ad: 0,
  ba: 0, bb: 0, bc: 0, bd: 0,
  ca: 0, cb: 0, cc: 0, cd: 0,
  da: 0, db: 0, dc: 0, dd: 0
}
let buttons_keys = Object.keys(buttons)
let changedFlag = true
let renderGameArea = () => {
  Object.keys(buttons).forEach((key) => {
    document.querySelector(`.${key}`).innerHTML = buttons[key]
  })
  changedFlag = false
}

let randomGenerate = () => {
  return (Math.random() > 0.5) ? 2 : 4
}
let randomPickButton = () => {
  if (!changedFlag) {
    return
  }
  let void_buttons = buttons_keys.filter(value => !buttons[value])
  if (void_buttons.length) {
    let theButton = void_buttons[Math.floor(Math.random() * void_buttons.length)]
    buttons[theButton] = randomGenerate()
    renderGameArea()
  }
}
let slideLine = function (a, b, c, d, reverseFlag) {
  let result = [buttons[a], buttons[b], buttons[c], buttons[d]]
  result = result.filter(value => !!value)
  if (result.length === 4 && result[0] === result[1] && result[2] === result[3]) {
    result = [result[0] * 2, result[2] * 2]
  } else {
    if (reverseFlag) {
      while (result.length < 4) {
        result.unshift(0)
      }
    } else {
      while (result.length < 4) {
        result.push(0)
      }
    }

    function combineResult (result) {
      if (reverseFlag) {
        result.reverse()
      }
      [0, 1, 2].some((item) => {
        if (result[item] === result[item + 1]) {
          result[item] += result[item + 1]
          result[item + 1] = 0
          return true
        } else {
          return false
        }
      })
      if (reverseFlag) {
        result.reverse()
      }
    }

    combineResult(result)
  }

  result = result.filter(value => !!value)
  if (reverseFlag) {
    while (result.length < 4) {
      result.unshift(0)
    }
  } else {
    while (result.length < 4) {
      result.push(0)
    }
  }

  result.forEach((item, index) => {
    if (buttons[arguments[index]] !== item) {
      changedFlag = true
    }

    buttons[arguments[index]] = item
  })
}
let rowSlide = (reverseFlag) => {
  // default is left
  [0, 1, 2, 3].forEach((value) => {
    slideLine(...gameData[value], reverseFlag)
  })
  randomPickButton()
}
let columnSlide = (reverseFlag) => {
  // default is up
  [0, 1, 2, 3].forEach((value) => {
    slideLine(gameData[0][value], gameData[1][value], gameData[2][value], gameData[3][value], reverseFlag)
  })
  randomPickButton()
}
let keyHandle = (e) => {
  switch (e.keyCode) {
    case 37: // left
      rowSlide()
      break
    case 39: // right
      rowSlide(true)
      break
    case 38: // up
      columnSlide()
      break
    case 40: // down
      columnSlide(true)
      break
    default:
      break
  }
}
window.addEventListener('keyup', keyHandle)
// mobile support
let gameArea = document.querySelector('.game-area')

let hammer = new Hammer(gameArea)

hammer.get('swipe').set({
  direction: Hammer.DIRECTION_ALL
})

hammer.on('swipeleft swiperight swipeup swipedown', function (event) {
  switch (event.type) {
    case 'swipeleft':
      rowSlide()
      break
    case 'swiperight':
      rowSlide(true)
      break
    case 'swipeup':
      columnSlide()
      break
    case 'swipedown':
      columnSlide(true)
      break
    default:
      break
  }
})