
import { Enemy, Player, EnemyBullet, PlayerBullet } from './models';
import inputs from './inputs';
import keys from './keystates';
import GameState from './states';

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
			let frozenKeys = Object.assign({}, keys);
			Object.freeze(frozenKeys);
			let newGameState = gameState.updateIfGameIsRunning(frozenKeys);
			draw(newGameState);
		};
		function draw(gameState) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			gameState.enemies.forEach(function(item, indx, array) {
				drawRect(item);
			});
			gameState.enemyBullets.concat(gameState.playerBullets).forEach(function(item, indx, array) {
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
		draw(GameState({inputs}));
	});

}());









