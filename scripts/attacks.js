
class Attacks {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.enemies = scene.enemies;
        this.crosshair = scene.crosshair;
        this.time = scene.time;
        this.player = scene.player;
        this.map = scene.map;


        // shoot out of butt
        // this.time.addEvent({
        //     delay: 50,
        //     callback: () => {
        //         if (this.player?.sprite()?.active === false) return;

        //         let posA = {
        //             x: this.player.sprite().x,
        //             y: this.player.sprite().y,
        //         };
        //         // below player (camera rotation)
        //         let posB = {
        //             x: this.player.sprite().x - 100 * Math.cos(this.player.sprite().rotation),
        //             y: this.player.sprite().y - 100 * Math.sin(this.player.sprite().rotation),
        //         };

        //         this.shootBullet(posA, posB);
        //     },
        //     loop: true,
        // });

    }

    shootBullet(posA, posB, size = 2, speed = 300, isPlayerBullet = false) {
        // shoot bullet from point A toward point B
        let color = 0xff0000;
        if (isPlayerBullet) color = 0xffffff;
        const bullet = this.scene.add.circle(posA.x, posA.y, size, color);
        this.physics.add.existing(bullet);
        bullet.body.setCircle(10, -7.5, -7.5);
        if (isPlayerBullet) this.player.playerBullets.add(bullet);

        // aim bullet at point B
        this.physics.moveTo(bullet, posB.x, posB.y, speed);

        // destroy bullet after 1s
        this.time.addEvent({
            delay: 4000,
            callback: () => {
                bullet.destroy();
            },
        });
    }


    shootAtPlayer(enemy) {
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                // if enemy is destroyed, return
                if (!enemy.active) {
                    return;
                }

                //  50% chance nothing happens
                if (Math.random() < 0.2) {
                    return;
                }

                const bullet = this.scene.add.circle(0, 0, 10, 0xff0000);
                this.physics.add.existing(bullet);

                this.scene.enemies.enemyBullets.add(bullet);
                bullet.body.setCircle(10, -5, -5);
                bullet.body.setAllowGravity(false);
                bullet.setScale(0.3);
                bullet.x = enemy.x;
                bullet.y = enemy.y;

                if (this.player?.sprite()?.active === false) return;
                
                // aim at player
                bullet.body.setVelocity(
                    50 * Math.cos(this.physics.moveToObject(bullet, this.player.sprite(), 100)),
                    50 * Math.sin(this.physics.moveToObject(bullet, this.player.sprite(), 100))
                );

                // destroy bullet after 1s
                // this.time.addEvent({
                    // delay: 5000,
                    // callback: () => {
                        // console.log('test')
                        // if (bullet.active)
                        // bullet.destroy();
                    // },
                // });
            },
            loop: true,
        });
    }

    isLazering() {
        const hitbox = this.scene.add.circle(0, 0, 200, 0xffffff, 0.1);
        this.physics.add.existing(hitbox);
        hitbox.body.setCircle(200, 0, 0);
        hitbox.body.setAllowGravity(false);

        this.scene.events.on('update', () => {
            hitbox.x = this.player.sprite().x;
            hitbox.y = this.player.sprite().y;
        });

        // every 1sec
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.enemies.sprites().getChildren().forEach((enemy) => {
                    if (!enemy.active || !this.physics.overlap(hitbox, enemy)) return;

                    // create a line from player to enemy
                    const line = new Phaser.Geom.Line(this.player.sprite().x, this.player.sprite().y, enemy.x, enemy.y);
                    let laser = this.scene.add.graphics();
                    laser.lineStyle(2, 0xffffff);
                    laser.strokeLineShape(line);

                    // fade out
                    this.time.addEvent({
                        delay: 100,
                        callback: () => {
                            laser.setAlpha(laser.alpha - 0.2);
                        },
                        repeat: 5,
                    });

                    // destroy laser
                    this.time.addEvent({
                        delay: 500,
                        callback: () => {
                            laser.destroy();
                        },
                    });
                });
            },
            loop: true,
        });
    }

    autoAOEShooting() {
        const hitbox = this.scene.add.circle(0, 0, 100, 0xffffff);
        this.physics.add.existing(hitbox);
        hitbox.body.setCircle(100, 0, 0);
        hitbox.body.setAllowGravity(false);
        hitbox.setAlpha(0.1);

        const bulletSpeed = 50;

        // on update
        this.scene.events.on('update', () => {
            hitbox.x = this.player.sprite().x;
            hitbox.y = this.player.sprite().y;
        });

        // periodically shoot bullets at enemies within hitbox
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.enemies.sprites().getChildren().forEach((enemy) => {
                    if (!enemy.active || !this.physics.overlap(hitbox, enemy)) return;

                    const bullet = this.scene.add.circle(0, 0, 5, 0xffffff);

                    this.physics.add.existing(bullet);
                    bullet.body.setCircle(10, -5, -5);
                    bullet.body.setAllowGravity(false);
                    bullet.setScale(1);
                    this.player.playerBullets.add(bullet);

                    bullet.x = this.player.sprite().x;
                    bullet.y = this.player.sprite().y;

                    // shoot at enemy
                    this.physics.moveToObject(bullet, enemy, bulletSpeed);


                    // destroy bullet after 1s
                    this.time.addEvent({
                        delay: 2000,
                        callback: () => {
                            bullet.destroy();
                        },
                    });
                });
            },
            loop: true,
        });
    }

    isShootingNForward(n = 3) {
        let bouncey = false;
        this.player = this.scene.player;
        const bulletSpacing = 0.1;
        // shoot a bullet at every enemy
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                for (let i = 0; i < n; i++) {
                    if (!this.scene.settings['isShootingNForward']) return;

                    // if its the middle bullet or middle 2
                    let middle = false;
                    if (n % 2 === 1 && i === Math.floor(n / 2) || n % 2 === 0 && (i === n / 2 || i === n / 2 - 1)) {
                        middle = true;
                    }

                    const bullet = this.scene.add.circle(0, 0, 2, 0xffffff);

                    this.physics.add.existing(bullet);
                    bullet.body.setCircle(10, -7.5, -7.5);
                    this.player.playerBullets.add(bullet);
                    // is bouncey
                    bouncey ?? bullet.body.setBounce(1);
                    // bounces off world
                    bullet.body.setCollideWorldBounds(true);

                    

                    bullet.x = this.player.sprite().x;
                    bullet.y = this.player.sprite().y;
                    // spread bullets
                    const xVelocity = 250 * Math.cos(this.player.sprite().rotation + i * bulletSpacing - (n - 1) * bulletSpacing / 2);
                    const yVelocity = 250 * Math.sin(this.player.sprite().rotation + i * bulletSpacing - (n - 1) * bulletSpacing / 2);
                    bullet.body.setVelocity(
                        middle ? xVelocity * 1.05 : xVelocity,
                        middle ? yVelocity * 1.05 : yVelocity

                    );

    

                    // if bullet touches obstacle, shrink
                    this.physics.add.collider(bullet, this.scene.map.obstacles, (bullet, tile) => {
                        this.scene.tweens.add({
                            targets: bullet,
                            scale: 0,
                            duration: 100,
                            onComplete: () => {
                                bullet.destroy();
                            },
                        });
                    });
                }
            },
            loop: true,
        });
    }

    wallSpiral() {
        // find the cell the player is on. find the closest wall cell. shoot bullet from wall to player
        this.time.addEvent({
            delay: 250,
            callback: () => {
                if (this.player?.sprite()?.active === false) return;
                if (!this.scene?.map) return;

                //find all the black grid cells
                const walls = this.scene.map.grid.getChildren().filter((tile) => {
                    return tile.fillColor === 0x000000;
                });

                // find the wall closest to the player
                const wall = walls.reduce((closest, current) => {
                    const closestDistance = Phaser.Math.Distance.BetweenPoints(this.player.sprite(), closest);
                    const currentDistance = Phaser.Math.Distance.BetweenPoints(this.player.sprite(), current);
                    return currentDistance < closestDistance ? current : closest;
                });

                const wallPosition = {
                    x: wall.x + this.scene.map.tileWidth / 2,
                    y: wall.y + this.scene.map.tileHeight / 2,
                };

                const playerPosition = {
                    x: this.player.sprite().x,
                    y: this.player.sprite().y,
                };

                this.shootBullet(wallPosition, playerPosition, 5, 70);

                // shoot in the direction opposite to the player from the wallPosition
                const oppositeDirection = {
                    x: wallPosition.x - (playerPosition.x - wallPosition.x),
                    y: wallPosition.y - (playerPosition.y - wallPosition.y),
                };

                this.shootBullet(wallPosition, oppositeDirection, 5, 70);
            },
            loop: true,
        });
    }
}

export default Attacks;