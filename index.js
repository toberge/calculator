import { evaluate } from "./calculator.js";

/* Color scheme 'plum' is taken from https://www.schemecolor.com/cut-plum-fruit-color-scheme.php */

const themes = {
  'standard': {
    'bg': 'white',
    'fg': 'black',
    'link': 'blue',
    'button': 'lightgrey',
  },
  'plum': {
    'bg': '#4C0C2D',
    'fg': '#FCCEA1',
    'link': '#FA9040',
    'button': '#811453',
  }
}

const nextTheme = {
  'standard': 'plum',
  'plum': 'standard'
}

const evaluateToString = expression => {
  try {
    // Using toFixed to round off problems like sin(pi) = 1.2246467991473532e-16
    // (this is a bit of a hack, yes)
    return String(parseFloat(evaluate(expression).toFixed(14)))
      .replace('Infinity', '∞');
  } catch (e) {
    if (e.message === 'expression is null') {
      if (expression === '') {
        return 'Your result appears here';
      } else {
        return 'Invalid input';
      }
    } else {
      return e.message;
    }
  }
}

window.onload = function() {
  const expressionField = document.getElementById('expression');
  const resultField = document.getElementById('result');
  const form = document.getElementById('form');
  const themeButton = document.getElementById('theme');
  const root = document.documentElement;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (event.target && expressionField.value) {
      resultField.innerText = evaluateToString(expressionField.value);
    } else {
      resultField.innerText = 'Your result appears here';
    }
  });

  let currentTheme = 'standard';

  themeButton.addEventListener('click', _ => {
    currentTheme = nextTheme[currentTheme];
    for (const [attribute, value] of Object.entries(themes[currentTheme])) {
      root.style.setProperty(`--${attribute}-color`, value);
    }
  });

  // For automatic evaluation:
  // expressionField.oninput = event => {
  //   form.onsubmit({
  //     target: 'truthy value',
  //     preventDefault() {
  //     }});
  // };
}