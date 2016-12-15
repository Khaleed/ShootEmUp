'use strict';

import inputs from './input';
import keys from './keystate';
import GameState from './state';

function playSounds(oldState, newState, inputs) {
    if (oldState.enemies.length > newState.enemies.length) {
        inputs.invaderDiesSound.play();
    }
}

keys.addListeners();

window.addEventListener('load', () => {
    const shipImg = document.getElementById('player');
    const invaderImg = document.getElementById('invader');
    const screen = inputs.canvas.getContext('2d');

    inputs.canvas.width = 800;
    inputs.canvas.height = 600;

    function drawRect(rect) {
        screen.fillStyle = rect.color;
        screen.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    function drawPlayer(player) {
        screen.drawImage(shipImg, player.x, player.y);
    }

    function drawInvader(pos) {
        screen.drawImage(invaderImg, pos.x, pos.y);
    }

    function draw(gameState, lastFrameTime, inputs) {
        screen.clearRect(0, 0, inputs.canvas.width, inputs.canvas.height);
        gameState.enemies.map(enemy => drawInvader(enemy));
        gameState.enemyBullets.concat(gameState.playerBullets).map(bullet => drawRect(bullet));
        gameState.particles.map(particle => drawRect(particle));
        if (gameState.player && !gameState.playerDying) {
            drawPlayer(gameState.player);
        }
        requestAnimationFrame(() => update(gameState, lastFrameTime, inputs));
    }

    function update(gameState, lastFrameTime, inputs) {
        const thisFrameTime = new Date().getTime();
        const thisFrameDuration = thisFrameTime - (lastFrameTime || thisFrameTime);
        const frozenKeys = Object.assign({}, keys);
        Object.freeze(frozenKeys);
        const newGameState = gameState.updateIfGameIsRunning(frozenKeys, thisFrameDuration);
        playSounds(gameState, newGameState, inputs);
        draw(newGameState, thisFrameTime, inputs);
    }
    draw(GameState({inputs}), 0, inputs);
});
