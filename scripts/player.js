// enemy.js
class Player {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.crosshair = scene.crosshair;
        this.player = scene.player;
        this.time = scene.time;
        this.player = scene.player;
        this.enemies = scene.enemies;
        this.path = scene.path;
        this.input = scene.input;
        this.cameras = scene.cameras;
        this.height = scene.height;
        this.width = scene.width;

        this.playerSpawn = { x: 400, y: this.height - 200 };

        this.player = this.physics.add.image(this.playerSpawn.x, this.playerSpawn.y, 'player').setScale(0.3).setRotation(-Math.PI / 2);

        this.player.setCollideWorldBounds(true);
        this.player.body.setCircle(15, 10, 10);
        this.player.setAngularDrag(10);
        this.player.setDrag(10);
        this.player.setMaxVelocity(1);
        this.playerSpeed = 0.01;

        this.playerBullets = this.physics.add.group();

        this.leaveTrail();
        this.isLazering();
        this.layMines();
        this.isShootingForward();
        this.isShootingNForward();
        this.playerHeatBar();

        // if (this.scene.settings['isShooting']) {
        this.isShooting();

        this.isLockingOn();
        this.playerExpBar();
        // } else {
        // this.isShooting(false);
        // }

    }

    sprite() {
        return this.player;
    }

    update() {
        let nonPath = [
            ...this.scene.map.grid.getChildren().filter((tile) => {
                return tile.fillColor === 0x000000;
            }),
            ...this.scene?.map?.obstacles?.getChildren() ?? [],
        ];

        // if player overlaping nonpath
        if (this.physics.overlap(this.player, nonPath)) {
            this.playerSpeed = 0.01;
        } else {
            // this.player.clearTint();
        }
    }

    // long line that stays
    // this.time.addEvent({
    //     delay: 2000,
    //     callback: () => {
    //         let enemy1 = this.enemies.sprites().getChildren()[0];
    //         let enemy2 = this.enemies.sprites().getChildren()[1];

    //         const line = new Phaser.Geom.Line(this.player.sprite().x, this.player.sprite().y, enemy1.x, enemy1.y);
    //         const graphics = this.add.graphics();
    //         graphics.lineStyle(1, 0xff0000, 1);
    //         graphics.strokeLineShape(line);
    //         this.time.addEvent({
    //             delay: 2000,
    //             callback: () => {
    //                 graphics.destroy();
    //             },
    //         });
    //     },
    //     loop: true,
    // });

    isLockingOn() {
        if (!this.scene.settings['isLockingOn']) return;

        // create a circle 200px in front of player
        const distanceFromPlayer = 120;
        const circleSize = 50;
        const circle = this.scene.add.circle(0, 0, circleSize, 0xffffff);
        this.physics.add.existing(circle);
        circle.setStrokeStyle(1, 0x0000ff);
        //show only stroke
        circle.setFillStyle(0x000000, 0);
        circle.body.setCircle(circleSize, -circleSize / 2, -circleSize / 2);

        // on scene update circle position
        this.scene.events.on('update', () => {
            circle.x = this.player.x + distanceFromPlayer * Math.cos(this.player.rotation);
            circle.y = this.player.y + distanceFromPlayer * Math.sin(this.player.rotation);

            // check if enemy is in circle
            this.scene.enemies.sprites().getChildren().forEach((enemy) => {
                if (this.physics.overlap(circle, enemy)) {
                    console.log('enemy in circle')
                    // enemy.setTint(0xff0000);
                    // create a line from the player to the enemy
                    const line = new Phaser.Geom.Line(this.player.x, this.player.y, enemy.x, enemy.y);
                    const graphics = this.scene.add.graphics();
                    graphics.lineStyle(1, 0xff0000, 1);
                    graphics.strokeLineShape(line);
                    this.time.addEvent({
                        delay: 10,
                        callback: () => {
                            graphics.destroy();
                        },
                    });
                    return;
                } else {
                    // enemy.clearTint();
                }
            });
        });






        return;
        // every 1sec
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.scene.settings['isLockingOn']) return;

                // get closest enemy
                const enemy = this.physics.closest(this.player, this.scene.enemies.sprites().getChildren());

                // do nothing if no enemy
                if (!enemy) {
                    return;
                }

                // do nothing if not red
                if (enemy.tintTopLeft !== 0xff0000) {
                    return;
                }

                // create line from player to enemy
                const line = new Phaser.Geom.Line(this.player.x, this.player.y, enemy.x, enemy.y);
                const graphics = this.scene.add.graphics();
                graphics.lineStyle(1, 0xff0000, 1);
                graphics.strokeLineShape(line);
                this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        graphics.destroy();
                    },
                });
            },
            loop: true,
        });
    }

    layMines() {
        // every 1sec
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.scene.settings['isLayingMines']) return;

                // create mine (circle shape)new Phaser.Geom.Circle(this.player.x, this.player.y, 5);
                const mine = this.scene.add.circle(this.player.x, this.player.y, 15, 0x00ff00);
                this.physics.add.existing(mine);
                mine.body.setCircle(30, -15, -15);
                mine.body.setAllowGravity(false);
                mine.setScale(1);

                // every 1sec
                this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        // if overlapping with enemy
                        if (this.physics.overlap(mine, this.scene.enemies.sprites().getChildren())) {
                            mine.setScale(3);

                            // wait 0.5s
                            this.time.addEvent({
                                delay: 500,
                                callback: () => {

                                    // remove enemy
                                    this.scene.enemies.sprites().getChildren().forEach((enemy) => {
                                        if (this.physics.overlap(mine, enemy)) {
                                            enemy.destroy();
                                        }
                                    });


                                    // remove mine
                                    mine.destroy();
                                },
                            });
                        }
                    },
                    loop: true,
                });
            },
            loop: true,
        });
    }

    isLazering() {
        // every 1sec
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                if (!this.scene.settings['isLazering']) return;

                // get closest enemy
                const enemy = this.physics.closest(this.player, this.scene.enemies.sprites().getChildren());

                // do nothing if no enemy
                if (!enemy) {
                    return;
                }

                // do nothing if not red
                if (enemy.tintTopLeft !== 0xff0000) {
                    return;
                }

                const line = new Phaser.Geom.Line(this.player.x, this.player.y, enemy.x, enemy.y);
                const graphics = this.scene.add.graphics();
                graphics.lineStyle(50, 0xff0000, 15);
                graphics.strokeLineShape(line);
                this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        graphics.destroy();
                    },
                });
            },
            loop: true,
        });
    }

    playerHeatBar() {
        this.playerHeat = 0;

        // create 10 bars that float under the player

        const bar = this.scene.add.rectangle(0, 0, 2, 2, 0xff0000);
        bar.setDepth(1);

        // on scene update, update bar width
        this.scene.events.on('update', () => {
            const distanceFromPlayer = 0;
            bar.x = this.player.x - distanceFromPlayer * Math.cos(this.player.rotation);
            bar.y = this.player.y - distanceFromPlayer * Math.sin(this.player.rotation);
            bar.rotation = this.player.rotation + Math.PI / 2;

            // VERTICAL BAR
            // bar.scaleY = this.playerHeat > 0 ? this.playerHeat / 10 : 0;

            // HORIZONTAL BAR
            bar.scaleX = this.playerHeat > 0 ? this.playerHeat / 10 : 0;
        });


        // on scene update
        this.scene.events.on('update', () => {
            this.playerHeat += Math.abs(this.playerSpeed) - 1;

            if (this.playerHeat < 0) {
                this.playerHeat = 0;
            }

        });

    }

    playerExpBar() {
        this.playerTotalHealth = 100;
        this.playerHealth = 100;

        // create a bar for each 10 health
        for (let i = 0; i < this.playerTotalHealth / 10; i++) {
            const bar = this.scene.add.rectangle(0, 0, 20, 5, 0x00ff00);


            bar.setDepth(1);

            // on scene update, update bar width
            this.scene.events.on('update', () => {
                bar.x = this.player.x - 50 * Math.cos(this.player.rotation);
                bar.y = this.player.y - 50 * Math.sin(this.player.rotation);
                bar.rotation = this.player.rotation + Math.PI / 2;
            });
        }
        // const bar = this.scene.add.rectangle(0, 0, 2, 5, 0x00ff00);
        // bar.setDepth(1);

        // // on scene update place it below player
        // this.scene.events.on('update', () => {
        //     // place under player, 50px below, account for player rotation
        //     bar.x = this.player.x - 50 * Math.cos(this.player.rotation);
        //     bar.y = this.player.y - 50 * Math.sin(this.player.rotation);

        //     // rotate
        //     bar.rotation = this.player.rotation + Math.PI / 2;

        // });
    }

    isShootingNForward(n = 3) {
        const bulletSpacing = 0.1;
        // shoot a bullet at every enemy
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                for (let i = 0; i < n; i++) {
                    if (!this.scene.settings['isShootingNForward']) return;

                    // if (this.playerHeat <= 5) return;

                    // this.playerHeat -= 5;


                    // if its the middle bullet or middle 2
                    let middle = false;
                    if (n % 2 === 1 && i === Math.floor(n / 2) || n % 2 === 0 && (i === n / 2 || i === n / 2 - 1)) {
                        middle = true;
                    }

                    const bullet = this.scene.add.circle(0, 0, 2, 0xffffff);

                    this.physics.add.existing(bullet);
                    bullet.body.setCircle(10, -5, -5);
                    bullet.body.setAllowGravity(false);
                    bullet.setScale(1);
                    this.playerBullets.add(bullet);

                    bullet.x = this.player.x;
                    bullet.y = this.player.y;
                    // spread bullets
                    const xVelocity = 250 * Math.cos(this.player.rotation + i * bulletSpacing - (n - 1) * bulletSpacing / 2);
                    const yVelocity = 250 * Math.sin(this.player.rotation + i * bulletSpacing - (n - 1) * bulletSpacing / 2);
                    bullet.body.setVelocity(
                        middle ? xVelocity * 1.05 : xVelocity,
                        middle ? yVelocity * 1.05 : yVelocity

                    );

                    bullet.body.debugShowVelocity = false;
                }
            },
            loop: true,
        });
    }

    isShootingForward() {
        // shoot a bullet at every enemy
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.scene.settings['isShootingForward']) return;

                const bullet = this.scene.add.circle(0, 0, 5, 0xffffff);

                this.physics.add.existing(bullet);
                bullet.body.setCircle(10, -5, -5);
                bullet.body.setAllowGravity(false);
                bullet.setScale(1);
                this.playerBullets.add(bullet);

                bullet.x = this.player.x;
                bullet.y = this.player.y;
                // aim in front of player
                bullet.body.setVelocity(
                    250 * Math.cos(this.player.rotation),
                    250 * Math.sin(this.player.rotation)
                );

                bullet.body.debugShowVelocity = false;


                // destroy bullet after 1s
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        bullet.destroy();
                    },

                });
            },
            loop: true,
        });
    }

    isShooting() {
        // shoot a bullet at every enemy
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.scene.settings['isShooting']) return;

                this.scene.enemies.sprites().getChildren().forEach((enemy) => {
                    // do nothing if not red
                    if (enemy.tintTopLeft !== 0xff0000) {
                        return;
                    }

                    const bullet = this.scene.add.circle(0, 0, 5, 0xffffff);

                    this.physics.add.existing(bullet);
                    bullet.body.setCircle(10, -5, -5);
                    bullet.body.setAllowGravity(false);
                    bullet.setScale(1);
                    this.playerBullets.add(bullet);

                    bullet.x = this.player.x;
                    bullet.y = this.player.y;
                    // aim at enemy
                    bullet.body.setVelocity(
                        50 * Math.cos(this.physics.moveToObject(bullet, enemy, 100)),
                        50 * Math.sin(this.physics.moveToObject(bullet, enemy, 100))
                    );

                    bullet.body.debugShowVelocity = false;


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

    movement() {
        // console.log('movement');
        // set camera rotation to player rotation


        // offset player rotation by 90 degrees
        // this.player.rotation = this.player.rotation + Math.PI / 2;

        const Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // if player is on path
        if (this.physics.overlap(this.player, this.path)) {
            // console.log('on path');
            // this.player.setScale(5);
            // this.playerSpeed += 0.1;
        } else {
            // console.log('off path');
            // this.playerSpeed -= 0.01;
        }

        // move forward
        if (Wkey.isDown) {
            // this.playerSpeed += 0.02;
            this.playerSpeed < 2 ? this.playerSpeed += 0.03 : this.playerSpeed = 2;
            // this.playerSpeed = 1;
        } else if (Skey.isDown) {
            // this.playerSpeed = -1;
            // this.playerSpeed -= 0.02;
            this.playerSpeed > -2 ? this.playerSpeed -= 0.03 : this.playerSpeed = -2;

        } else {
            // this.playerSpeed > 0 ? this.playerSpeed -= 0.01 : this.playerSpeed += 0.001;
        }
        this.player.x += this.playerSpeed * Math.cos(this.player.rotation);
        this.player.y += this.playerSpeed * Math.sin(this.player.rotation);

        // rotate via A/D keys or pointer
        // angular velocity is affected by speed
        if (Akey.isDown || this.input.activePointer.isDown && this.input.activePointer.x < this.width / 2) {
            // sort of hard and slidey
            // this.player.setAngularVelocity(
            // -50
            // this.player.body.angularVelocity -= 2
            // )

            // slidey
            // this.player.setAngularVelocity(
            //     this.player.body.angularVelocity - 1.5
            // );

            // hard turn
            this.player.rotation -= 0.015;
        } else if (Dkey.isDown || this.input.activePointer.isDown && this.input.activePointer.x > this.width / 2) {
            // this.player.setAngularVelocity(50 + this.playerSpeed * 10);
            // this.player.setAngularVelocity(
            // this.player.body.angularVelocity += 7
            // );
            // this.player.setAngularVelocity(50)
            this.player.rotation += 0.015;
        } else {
            // set angular velocity closer to 0
            // this.player.setAngularVelocity(
            // this.player.body.angularVelocity * 0.99
            // );
        }
    }

    leaveTrail() {
        this.time.addEvent({
            delay: 50,
            callback: () => {
                if (!this.scene.settings['leaveTrail']) return;

                // leave a temporary blue trail that shrinks over time
                const trail = this.scene.add.circle(this.player.x, this.player.y, 5, 0x0000ff);

                trail.setDepth(-1);

                this.time.addEvent({
                    delay: 50,
                    callback: (i) => {
                        trail.setScale(trail.scaleX - 0.1);
                        trail.setAlpha(trail.alpha - 0.15);
                    },
                    repeat: 10,
                });

                this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        trail.destroy();
                    },
                });
            },
            loop: true,
        });

    }
}

export default Player;