## Why?

Pick up higher-level problem solving skills and dive deeper into writing functional JavaScript using the better parts of ES2015/ES2016 by making a real-time action game from scratch.

## Game Logic

This is a bare-bones implementation of the classic shooting game Space Invaders. The player must shoot all the invaders before they reach the player to win. The invaders randomly keep shooting and slowly move towards the player.

## Approach

Drawing on the canvas, the game loop, and collision detection are all done without any libraries or frameworks. This project was written in a functional programming style using ideas borrowed from Clojure's and Elm. It's not purely functional because of the limitations of JavaScript and I/O being inheritently impure. Instead of deep cloning objects and arrays, one could use a persistent data structure library such as MORI.

## Contributors

Many people from the Recurse Centre have paired with me on this project. I would like to thank David Hargat for showing me how to make JavaScript games, Sal Becker for teaching me functional programming, Diego Berrocal for introducing me to JavasScript ES2015, Ralph Barton and Pierre-Yves Baccou for helping me with the computer animation physics, and Marijn Haverbeke, the author of Eloquent JavaScript, for helping me refactor to make the game even more functional.

## Play

Play the game on http://Khaleed.github.io/ShootEmUp


<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11322973/9e557144-910b-11e5-959a-8fdaaa4a88c5.png' height='14px'/></a>
