'use strict';

import inputs from './input';
import keys from './keystate';
import GameState from './state';

(function() {
	let canvas = inputs.canvas;
	let status = inputs.status;
	keys.addListeners();

	function playSounds(oldState, newState) {
		if (oldState.enemies.length > newState.enemies.length) {
			inputs.invaderDiesSound.play();
		}
	}

	window.addEventListener('load', () => {
		let ctx;

		var shipImg = new Image();
		var invaderImg = new Image();

		shipImg.src = 'images/smallship.png';
		invaderImg.src = 'images/smallinvader.png';

		if (canvas.getContext === undefined) {
			console.error('browser does not support canvas');
		} else {
			ctx = canvas.getContext('2d');
		}
		canvas.width = 800;
		canvas.height = 600;

		function drawRect(rect) {
			ctx.fillStyle = rect.color;
			ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
		}

		function drawPlayer(player) {
			ctx.drawImage(shipImg, player.x, player.y);
		}

		function drawInvader(pos) {
			ctx.drawImage(invaderImg, pos.x, pos.y);
		}

		function draw(gameState) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			gameState.enemies.map(enemy => drawInvader(enemy));
			gameState.enemyBullets.concat(gameState.playerBullets).map(bullet => drawRect(bullet));
			if (gameState.player) {
				drawPlayer(gameState.player);
			}
			setTimeout(() => update(gameState), 1);
		};

		function update(gameState) {
			let frozenKeys = Object.assign({}, keys);
			Object.freeze(frozenKeys);
			let newGameState = gameState.updateIfGameIsRunning(frozenKeys);
			playSounds(gameState, newGameState);
			draw(newGameState);
		};
		draw(GameState({
			inputs
		}));
	});
}());









