
class Attacks {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.crosshair = scene.crosshair;
        this.time = scene.time;
        this.player = scene.player;
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
                console.log('lazering');
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
                    bullet.body.setBounce(1);
                    this.player.playerBullets.add(bullet);

                    bullet.x = this.player.sprite().x;
                    bullet.y = this.player.sprite().y;
                    // spread bullets
                    const xVelocity = 250 * Math.cos(this.player.sprite().rotation + i * bulletSpacing - (n - 1) * bulletSpacing / 2);
                    const yVelocity = 250 * Math.sin(this.player.sprite().rotation + i * bulletSpacing - (n - 1) * bulletSpacing / 2);
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
}

export default Attacks;