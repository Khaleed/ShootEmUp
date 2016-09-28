'use strict';

import { AssocMixin, MergeMixin, Player, Enemy, EnemyBullet, PlayerBullet, Particle, cond, conj } from './model';

function sqCollide(s1, s2) {
    const c1 = s1.x < s2.x + s2.w; // right edge of square 1 is to the right of left edge of square 2
    const c2 = s2.x < s1.x + s1.w; // left edge of square 1 is to the left of right edge of square 2
    const c3 = s1.y + s1.h > s2.y; // top edge of square 1 is above bottom edge of square 2
    const c4 = s2.y + s2.h > s1.y; //  bottom edge of the square 1 is below the top edge of the square 2
    return (c1 && c2 && c3 && c4);
}

function createSizedArr(x) {
    return Array.apply(null, Array(x));
}

function range(start, end) {
    if (end > start) {
        return Object.freeze(createSizedArr(end - start).map((_, i) => start + i));
    } else {
        return [start];
    }
}

function createEnemyBodies() {
    const iter = range(0, 8);
    return iter.map(i => {
        return iter.map(j => {
            return Enemy({
                x: 45 * i,
                y: 20 + 45 * j
            });
        });
    }).reduce((result, next) => result.concat(next));
}

export default function GameState(args) {
    const { inputs, x = 0, y = 0, gameRunning = true, playerDying = false, playerBullets = [], enemyBullets = [], particles = [], enemies = createEnemyBodies(),
            player = Player({}), playerBulletNframeCounter = 0, playerFinalBulletNframeCount = 10, velX = 0.2 } = args;
    const assoc = AssocMixin(GameState, args);
    const merge = MergeMixin(GameState, args);
    Object.freeze(enemies);
    Object.freeze(playerBullets);
    Object.freeze(enemyBullets);
    Object.freeze(particles);

    function newDir(keys) {
        return cond(
            () => keys.leftPressedKey === true && player.x > 0, () => -1,
            () => keys.rightPressedKey === true && player.x < inputs.canvas.width - 55, () => 1,
            () => 0);
    }

    function updatePlayerMovement(keys, thisFrameDuration) {
        return assoc("player", cond(
            () => player, () => player.assoc("x", player.x + newDir(keys) * 0.5 * thisFrameDuration),
            () => false));
    }

    function updatePlayerAction(keys, thisFrameDuration) {
        return cond(
            () => keys.spacePressedKey === true, () => updatePlayerMovement(keys, thisFrameDuration).playerShoots(),
            () => updatePlayerMovement(keys, thisFrameDuration));
    }

    function maybeRestart(keys) {
        return keys.rPressedKey ? GameState({ args }) : that;
    }

    function updateIfGameIsRunning(keys, thisFrameDuration) {
        const state = maybeRestart(keys);
        return gameRunning ? state.updateGameLoop(keys, thisFrameDuration) : state;
    }

    function removeOffscreen(bodies) {
        // return only the bodies that are within the canvas
        return bodies.filter(
            obj => {
                // filter only
                return ((obj.x > 0) &&
                        (obj.y > 0) &&
                        (obj.x < inputs.canvas.width) &&
                        (obj.y < inputs.canvas.height));
            });
    }

    function updateBodies(thisFrameDuration) {
        return merge({
            playerBullets: removeOffscreen(playerBullets.map(bullet => bullet.update(thisFrameDuration))),
            enemyBullets: removeOffscreen(enemyBullets.map(bullet => bullet.update(thisFrameDuration))),
            particles: removeOffscreen(particles.map(particle => particle.update(thisFrameDuration))),
            player: player.update(),
            enemies: enemies.map(enemy => enemy.update(velX, thisFrameDuration))
        });
    }

    function makeNewBullet() {
        inputs.playerShootSound.play();
        return conj(playerBullets, PlayerBullet({
            x: player.x + player.w / 2,
            y: player.y
        }));
    }

    function playerShoots() {
        const newBullets = cond(
            () => playerBulletNframeCounter === 0, makeNewBullet, // playerBulletNframeCounter => counting frames between shots
            () => playerBullets);
        const newCounter = cond(
            () => playerBulletNframeCounter > 0, () => playerBulletNframeCounter - 1,
            () => playerFinalBulletNframeCount);
        const newGameState = merge({
            playerBulletNframeCounter: newCounter,
            playerBullets: newBullets
        });
        return newGameState;
    };

    function enemyShoots() {
        const randIndx = Math.floor(Math.random() * (enemies.length - 1));
        const enemy = enemies[randIndx];
        const newBullets = Object.assign([], enemyBullets);
        const b = EnemyBullet({
            x: enemy.x,
            y: enemy.y
        });
        newBullets.push(b);
        inputs.invaderShootSound.play();
        const newGameState = assoc('enemyBullets', newBullets);
        return newGameState;
    }

    function enemyShootsAI() {
        if ((Math.random() * 20) <= 1) {
            return enemyShoots();
        } else {
            return that;
        }
    }

    function playerDies() {
        inputs.status.innerHTML = 'You lose';
        return merge({
            gameRunning: false,
            playerDying: false,
            enemies: [],
            enemyBullets: [],
            playerBullets: [],
            particles:[],
            player: false
        });
    }

    function playerWins() {
        inputs.status.innerHTML = 'You win';
        return merge({
            gameRunning: false,
            playerDying: false,
            enemies: [],
            playerBullets: [],
            enemyBullets: [],
            particles:[]
        });
    }

    function enemyCollisionWithBorder() {
        let newVelX = velX;
        let newEnemies = enemies;
        let velY = 10;
        const newGameRunning = gameRunning;
        if (enemies.length > 0) {
            //detect if enemies block has hit wall, and if so make it bounce...
            const leftMostEnemPix = enemies[0].x;
            const rightMostEnemPix = enemies[enemies.length - 1].x + enemies[0].w;
            if (leftMostEnemPix < 0 || rightMostEnemPix > inputs.canvas.width) {
                newVelX = newVelX * -1;
                newEnemies = enemies.map(enemy => {
                    const newY = enemy.y + velY;
                    return enemy.assoc('y', newY);
                });
            }
           //either detect game-over, or return a new game state...
            const killPlayerZoneReached = newEnemies.some(enemy => enemy.y > 500);
            if (killPlayerZoneReached && !playerDying) {
                return playerDies();
            } else {
                const newGameState = merge({
                    velX: newVelX,
                    enemies: newEnemies,
                    gameRunning: newGameRunning
                });
                return newGameState;
            }
        } else {
            return null;
        }
    }

    function enemyHitBy(bullet) {
        return enemies.reduce((found, enemy) =>
            found || (sqCollide(enemy, bullet) ? enemy : null), null);
    }

    function randomBetween(a, b) {
        return (a + (b - a) * Math.random());
    }

    function createParticles(origin, newParticles) {
        const iter = range(0, 5);
        return iter.map(() => {
            return newParticles.push(Particle({
                x:  origin.x,
                y:  origin.y,
                vx: randomBetween (-0.1, 0.1),
                vy: randomBetween (-0.5, 0.0),
		color: 'rgba(255, 255, 255,' + Math.random() + ')'
            }));
        });
    }

    function createDeathParticles(origin, newParticles) {
        const iter = range(0, 60);
        return iter.map(() => {
            return newParticles.push(Particle({
                x:  origin.x + 15,
                y:  origin.y - 15,
                vx: randomBetween (-0.4, 0.4),
                vy: randomBetween (-3.5, 0.0),
		color: 'rgba(0, 255, 0, 255)'
            }));
        });
    }

    function bulletCollision() {
        if (gameRunning && !playerDying) {
            const newParticles = [];
            if (enemyBullets.some(bullet => sqCollide(bullet, player))) {
                createDeathParticles(player, newParticles);
                const newGameState = merge({
                    playerDying: true,
                    particles: particles.concat(newParticles)
                });
                return newGameState;
            }
            const newGameRunning = gameRunning;
            const deadEnemies = [];
            const usedBullets = [];
            playerBullets.forEach(bullet => {
                const hit = enemyHitBy(bullet);
                if (hit) {
                    deadEnemies.push(hit);
                    usedBullets.push(bullet);
                    createParticles(bullet, newParticles);
                }
            });
            const newPlayerBullets = playerBullets.filter(b => usedBullets.indexOf(b) === -1);
            const newEnemies = enemies.filter(e => deadEnemies.indexOf(e) === -1);

            if (newEnemies.length === 0) {
                return playerWins();
            } else {
                const newGameState = merge({
                    gameRunning: newGameRunning,
                    playerBullets: newPlayerBullets,
                    enemies: newEnemies,
                    particles: particles.concat(newParticles)
                });
                return newGameState;
            }
        } else {
            return that;
        }
    }

    function updateGameLoop(keys, thisFrameDuration) {
	if (playerDying) {
	    if (particles.length == 0)
		return playerDies();
	    else
		return updateBodies(thisFrameDuration).enemyCollisionWithBorder().enemyShootsAI().bulletCollision();
	}
	else
            return updatePlayerAction(keys, thisFrameDuration).updateBodies(thisFrameDuration).enemyCollisionWithBorder().enemyShootsAI().bulletCollision();
    }

    const that = Object.freeze({
        x,
        y,
        gameRunning,
        playerDying,
        enemyBullets,
        playerBullets,
        particles,
        enemies,
        playerFinalBulletNframeCount,
        playerBulletNframeCounter,
        player,
        updateIfGameIsRunning,
        bulletCollision,
        enemyCollisionWithBorder,
        enemyShootsAI,
        updateBodies,
        playerShoots,
        updateGameLoop,
        assoc,
        merge
    });
    return that;
}
