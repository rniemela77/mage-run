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

        this.player = this.physics.add.image(this.playerSpawn.x, this.playerSpawn.y, 'player').setScale(1).setRotation(-Math.PI / 2);

        this.player.setCollideWorldBounds(true);
        this.player.body.setCircle(15, 10, 10);
        this.player.setAngularDrag(10);
        this.player.setDrag(10);
        this.player.setMaxVelocity(500);
        this.player.setScale(0.3);
        this.playerSpeed = 0.01;

        this.playerBullets = this.physics.add.group();

        this.isShooting();
        this.leaveTrail();
        // this.time.addEvent({
        // delay: 2500,
        // callback: () => {
        // console.log(this.scene.enemies.sprites())
        // },
        // loop: true,
        // });
    }

    sprite() {
        return this.player;
    }

    isShooting() {
        // shoot a bullet at every enemy
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.enemies.sprites().getChildren().forEach((enemy) => {
                    // do nothing if not red
                    if (enemy.tintTopLeft !== 0xff0000) {
                        return;
                    }

                    const bullet = this.scene.add.circle(0, 0, 5, 0xffffff);
                    
                    this.physics.add.existing(bullet);
                    bullet.body.setCircle(10, -5, -5);
                    bullet.body.setAllowGravity(false);
                    bullet.setScale(0.3);
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

        } else if (Skey.isDown) {
            // this.playerSpeed -= 0.02;
            this.playerSpeed -= 0.03;
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
                // this.player.body.angularVelocity -= 7
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