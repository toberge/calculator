# Calculator

Simple infix calculator written in pure JavaScript.

It uses the [Shunting-Yard algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
to transform an infix expression like

`3 + 2` or `2 * (4 + 2)`

to an RPN (postfix) expression like

`3 2 +` or `2 4 2 + *`

which can be evaluated quite easily.

**Give it a try [here](https://toberge.github.io/calculator)!**

## Features

+ The usual set of binary operators: `+`, `-`, `*`, `/`, `^`
+ Unary minus (it has some edge cases)
+ Functions – `sin`, `cos`, `log`, `ln` and some more
+ Constants – just `pi` and `e` for the time being
+ Friendly instructions
+ Theme switcher (the only bit of bloat)

## Certifications

Tested with [this Kattis problem](https://open.kattis.com/problems/calculator)
(which includes unary minus).

## Thanks to...

+ Dijkstra for his algorithm
+ The many wonderful mathematicians who have brought us this far