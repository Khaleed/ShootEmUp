'use strict';

import inputs from './input';
import keys from './keystate';
import GameState from './state';

const canvas = inputs.canvas;
keys.addListeners();

function playSounds(oldState, newState) {
    if (oldState.enemies.length > newState.enemies.length) {
        inputs.invaderDiesSound.play();
    }
}

window.addEventListener('load', () => {
    let ctx;
    const shipImg = document.getElementById('player');
    const invaderImg = document.getElementById('invader');

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

    function draw(gameState, lastFrameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameState.enemies.map(enemy => drawInvader(enemy));
        gameState.enemyBullets.concat(gameState.playerBullets).map(bullet => drawRect(bullet));
        gameState.particles.map(particle => drawRect(particle));
        if (gameState.player && !gameState.playerDying) {
            drawPlayer(gameState.player);
        }
        requestAnimationFrame(() => update(gameState, lastFrameTime));
    }

    function update(gameState, lastFrameTime) {
        const thisFrameTime = new Date().getTime();
        const thisFrameDuration = thisFrameTime - (lastFrameTime || thisFrameTime);
        const frozenKeys = Object.assign({}, keys);
        Object.freeze(frozenKeys);
        const newGameState = gameState.updateIfGameIsRunning(frozenKeys, thisFrameDuration);
        playSounds(gameState, newGameState);
        draw(newGameState, thisFrameTime);
    }
    draw(GameState({inputs}), undefined); // lastFrameTime = null at the first frame
});
