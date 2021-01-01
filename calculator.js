const OperatorTypes = Object.freeze({
  'UNARY': 1,
  'BINARY': 2
});

// Function for defining generic functions
const makeFunction = fn => ({
  precedence: 6,
  type: OperatorTypes.UNARY,
  apply: fn
})

const operators = {
  '+': {
    precedence: 1,
    type: OperatorTypes.BINARY,
    apply: (y, x) => x + y
  },
  '-': {
    precedence: 1,
    type: OperatorTypes.BINARY,
    apply: (y, x) => x - y
  },
  '*': {
    precedence: 2,
    type: OperatorTypes.BINARY,
    apply: (y, x) => x * y
  },
  'x': { // Alias for *
    precedence: 2,
    type: OperatorTypes.BINARY,
    apply: (y, x) => x * y
  },
  '/': {
    precedence: 2,
    type: OperatorTypes.BINARY,
    apply: (y, x) => x / y
  },
  '^': {
    precedence: 3,
    type: OperatorTypes.BINARY,
    apply: (y, x) => Math.pow(x, y)
  },
  '~': {
    precedence: 5,
    type: OperatorTypes.UNARY,
    apply: x => -x
  },
  'ln': makeFunction(Math.log),
  'log': makeFunction(Math.log10),
  'sin': makeFunction(Math.sin),
  'sinh': makeFunction(Math.sinh),
  'asin': makeFunction(Math.asin),
  'asinh': makeFunction(Math.asinh),
  'cos': makeFunction(Math.cos),
  'cosh': makeFunction(Math.cosh),
  'acos': makeFunction(Math.acos),
  'acosh': makeFunction(Math.acosh),
};

const constants = {
  'e': Math.E,
  'pi': Math.PI,
};

/**
 * Split input into accepted tokens
 *
 * @param string      Input string
 * @return {[string]} List of tokens
 */
const lex = string => {
  return string.toLowerCase().match(/[+\-*/^()]|\d+([.,]\d+)?([eE][+-]?\d+)?|\w+/g);
};

/**
 * Translate an infix expression to an RPN expression
 *
 * @param expression
 * @return {[number | string]} List of output tokens
 */
const infixToRPN = expression => {
  const stack = [];
  const output = [];
  let last = '';

  for (const token of expression) {
    if (!isNaN(token)) { // A number!
      output.push(parseFloat(token));
    } else if (token in constants) {
      output.push(constants[token]);
    } else if (token === '-' && (!last || ((isNaN(last) && last !== ')') || last === '-'))) {
      // Complicated checks that ENSURE this is actually unary minus!
      stack.push('~');
    } else if (token in operators) { // An operator!
      const precedence = operators[token].precedence;
      while (stack.length > 0 &&
        (stack[stack.length - 1] !== '(' &&
          operators[stack[stack.length - 1]].precedence >= precedence))
        output.push(stack.pop());
      stack.push(token);
    } else if (token === '(') { // Start of paren!
      stack.push(token);
    } else if (token === ')') { // End of paren, unwrap!
      while (stack[stack.length-1] !== '(')
        output.push(stack.pop());
      if (stack[stack.length-1] === '(')
        stack.pop();
    } else {
      throw new Error(`Unknown operator or function: ${token}`);
    }
    last = token;
  }

  while (stack.length > 0)
    output.push(stack.pop());
  return output;
}

/**
 * Evaluate an RPN expression
 *
 * @param expression
 * @return {number} Result of calculation
 */
const evaluateRPN = expression => {
  const stack = [];

  for (const token of expression) {
    if (!isNaN(token)) { // A number!
      stack.push(token);
    } else if (token in operators) { // An operator!
      if (operators[token].type === OperatorTypes.BINARY) {
        if (stack.length < 2) // Are there two operands left?
          throw new Error('Too few operands!');
        stack.push(operators[token].apply(stack.pop(), stack.pop()));
      } else { // Unary operator, one argument
        if (stack.length < 1) // Are there any operands left?
          throw new Error('Too few operands!');
        stack.push(operators[token].apply(stack.pop()));
      }
    }
  }

  return stack.pop();
}

/**
 * Parse and evaluate an infix expression
 *
 * @param expression Infix expression to evaluate
 * @return {number}  Result of calculation
 */
export const evaluate = expression => {
  return evaluateRPN(infixToRPN(lex(expression)));
}

// Node.js IO for Kattis submission
// (requires removing the `export` keyword above!)
if (typeof window === 'undefined') {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: null,
  });
  readline.on('line', input => {
    console.log(evaluate(input).toFixed(2));
  })
}
