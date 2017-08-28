# ShootEmUp

## Why?

- Pick up higher-level problem solving skills.
- Dive deeper into writing functional JavaScript using the better parts of ES2015/ES2016.
- Make a real-time action game from scratch.

## Game Logic

- This is a bare-bones implementation of the classic shooting game _Space Invaders_. 
- The player must shoot all the invaders before they reach the player to win. 
- The invaders randomly keep shooting and slowly move towards the player.

## Approach

- Drawing on the canvas, the game loop, and collision detection are all done without any libraries or frameworks. 
- This project was written in a functional programming style using ideas borrowed from [Clojure](https://clojure.org/) and [Elm Architecture](https://guide.elm-lang.org/architecture/). 
- It's not purely functional because of the limitations of JavaScript and [I/O](https://en.wikipedia.org/wiki/Input/output) being inheritently impure. 
- Instead of deep cloning objects and arrays, one could use a persistent data structure library such as MORI. 

## Play

Play the game on http://Khaleed.github.io/ShootEmUp

## Installation

### Dependencies

To get dependencies

`npm install`

Install [Webpack](https://webpack.js.org/) globally 

`npm install webpack-devserver webpack -g`

### Server

To serve at http://localhost:8080/webpack-dev-server/

`npm run watch`

### Build

To build when NODE_ENV environmental variable is set to production

`npm run deploy`

## Contributors

I would like to thank the following awesome people:-

 - David Hargat for showing me how to make JavaScript games 
 - Sal Becker for teaching me functional programming
 - Diego Berrocal for introducing me to JavaScript ES2015 
 - Ralph Barton and Pierre-Yves Baccou for helping me with the computer animation physics
 - Marijn Haverbeke, the author of _Eloquent JavaScript_, for helping me refactor to make the game even more functional.

## License

ShootEmUp is released under the [GPL-3.O](https://opensource.org/licenses/lgpl-3.0.html) License.

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11322973/9e557144-910b-11e5-959a-8fdaaa4a88c5.png' height='14px'/></a>
