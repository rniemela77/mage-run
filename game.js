class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/triangle.png');
    }

    /*

                MODIFIERY

    */

    create() {
        this.player = this.physics.add.image(400, 300, 'player').setScale(1).setRotation(-Math.PI / 2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setCircle(15, 10, 10);
        this.player.setAngularDrag(40);
        this.player.setDrag(100);
        this.player.setMaxVelocity(200);
        this.player.setScale(0.3);

        this.playerSpeed = 1;

        //world bounds are black
        this.physics.world.setBounds(0, 0, width, height);
        this.add.rectangle(0, 0, width, 20, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 0, 20, height, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, height - 20, width, 20, 0x000000).setOrigin(0, 0);
        this.add.rectangle(width - 20, 0, 20, height, 0x000000).setOrigin(0, 0);

        // make the background a grid
        const gridSize = 500;
        for (let i = 0; i < width; i += gridSize) {
            this.add.rectangle(i, 0, 1, height, 0x000000).setOrigin(0, 0);
        }
        for (let i = 0; i < height; i += gridSize) {
            this.add.rectangle(0, i, width, 1, 0x000000).setOrigin(0, 0);
        }

        // center camera on player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(3);

        // group of enemies
        this.enemies = this.physics.add.group();

        // every 3 seconds
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                // find 200px in front of the player
                const enemyPositionX = this.player.x + 600 * Math.cos(this.player.rotation);
                const enemyPositionY = this.player.y + 600 * Math.sin(this.player.rotation);


                const enemy = this.physics.add.image(enemyPositionX, enemyPositionY, 'player').setScale(1).setRotation(-Math.PI / 2);
                enemy.setCollideWorldBounds(true);
                enemy.body.setCircle(15, 10, 10);
                enemy.setAngularDrag(40);
                enemy.setDrag(100);
                enemy.setMaxVelocity(200);
                enemy.setScale(0.5);
                this.enemies.add(enemy);

            },
            loop: true,
        });

        // every 1s, all enemies shoot bullets at player
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.enemies.getChildren().forEach((enemy) => {
                    //  50% chance nothing happens
                    if (Math.random() < 0.5) {
                        return;
                    }

                    const bullet = this.add.circle(0, 0, 10, 0xff0000);
                    this.physics.add.existing(bullet);
                    bullet.body.setCircle(30, -20, -20);
                    bullet.body.setAllowGravity(false);
                    bullet.setScale(0.3);
                    bullet.x = enemy.x;
                    bullet.y = enemy.y;
                    bullet.body.setVelocity(200 * Math.cos(this.physics.moveToObject(bullet, this.player, 100)), 200 * Math.sin(this.physics.moveToObject(bullet, this.player, 100)));

                    // remove debug graphics
                    // bullet.body.debugShowBody = false;
                    bullet.body.debugShowVelocity = false;

                    // check for collision with player
                    this.physics.add.overlap(this.player, bullet, (player, bullet) => {
                        // player.destroy();
                        // bullet.destroy();

                        //restart scene
                        this.scene.restart();
                    });

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

        // every 0.5s, shoot a bullet
        this.time.addEvent({
            delay: 300,
            callback: () => {
                // create white circle
                const bullet = this.add.circle(0, 0, 10, 0xffffff);
                this.physics.add.existing(bullet);
                bullet.body.setCircle(30, -20, -20);
                bullet.body.setAllowGravity(false);
                bullet.setScale(0.3);
                bullet.x = this.player.x + 0 * Math.cos(this.player.rotation);
                bullet.y = this.player.y + 0 * Math.sin(this.player.rotation);
                bullet.body.setVelocity(200 * Math.cos(this.player.rotation), 200 * Math.sin(this.player.rotation));


                // remove debug graphics
                // bullet.body.debugShowBody = false;
                bullet.body.debugShowVelocity = false;

                // check for collision with enemies
                this.physics.add.overlap(this.enemies, bullet, (enemy, bullet) => {
                    enemy.destroy();
                    bullet.destroy();
                });

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

    update() {
        // move enemies toward player
        this.enemies.getChildren().forEach((enemy) => {
            this.physics.moveToObject(enemy, this.player, 100);
        });


        const Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // move forward
        if (Wkey.isDown) {
            this.playerSpeed += 0.04;
        } else if (Skey.isDown) {
            this.playerSpeed -= 0.05
        } else {
            // (this.playerSpeed > 1) ? this.playerSpeed -= 0.01 : this.playerSpeed = 1;
            this.playerSpeed > 0 ? this.playerSpeed -= 0.001 : this.playerSpeed += 0.001;
        }
        this.player.x += this.playerSpeed * Math.cos(this.player.rotation);
        this.player.y += this.playerSpeed * Math.sin(this.player.rotation);

        // rotate 
        if (Akey.isDown) {
            this.player.setAngularVelocity(
                this.player.body.angularVelocity - 1.5
            );
        } else if (Dkey.isDown) {
            this.player.setAngularVelocity(
                this.player.body.angularVelocity + 1.5
            );
        } else {
            // set angular velocity closer to 0
            this.player.setAngularVelocity(
                this.player.body.angularVelocity * 0.95
            );
        }

        // set camera rotation to player rotation
        const cameraRotation = this.player.rotation + Math.PI / 2;
        this.cameras.main.setRotation(-cameraRotation);

        // leave a temporary blue trail
        const trail = this.add.circle(this.player.x, this.player.y, 5, 0x000000f);
        // put under player
        trail.depth = -1;

        // make trail get progressively smaller
        this.tweens.add({
            targets: trail,
            scale: 0,
            duration: 1000,
            onComplete: () => {
                trail.destroy();
            },
        });

        // make trail go from white to red
        this.tweens.add({
            targets: trail,
            fillAlpha: 0,
            duration: 1000,
            onComplete: () => {
                trail.destroy();
            },
        });
    }

}



let width = window.innerWidth * window.devicePixelRatio;
let height = window.innerHeight * window.devicePixelRatio;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: width,
    height: height,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x333333,
};

var game = new Phaser.Game(config);
