import GameState from './states';
import { Enemy, Player, EnemyBullet, PlayerBullet}
from './models';
import inputs from './inputs';
import keys from './keystates';

(function() {

	let canvas = inputs.canvas;
	let status = inputs.status;
	keys.addListeners();

	window.addEventListener('load', () => {
		let ctx;
		if (canvas.getContext === undefined) {
			console.error('browser does not support canvas');
		} else {
			ctx = canvas.getContext('2d');
		}
		canvas.width = 800;
		canvas.height = 600;
		// game loop
		function update(gameState) {
			let newGameState = gameState.update();
			draw(newGameState);
		};
		function draw(gameState) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			gameState.enemies.forEach(function(item, indx, array) {
				drawRect(item);
			});
			gameState.bullets.forEach(function(item, indx, array) {
				drawRect(item);
			});
			if (gameState.player) {
				drawRect(gameState.player);
			}
			setTimeout(() => update(gameState), 1);
		};

		function drawRect(rect) {
			ctx.fillStyle = rect.color;
			ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
		}
		draw(GameState({keys: keys, inputs}));
	});

}());









