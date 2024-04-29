class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/triangle.png');
    }

    /*

                MODIFIERY

    */

    create() {
        this.player = this.physics.add.image(400, height - 200, 'player').setScale(1).setRotation(-Math.PI / 2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setCircle(15, 10, 10);
        this.player.setAngularDrag(40);
        this.player.setDrag(100);
        this.player.setMaxVelocity(200);
        this.player.setScale(0.3);

        this.playerSpeed = 0.5;

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

        // player at bottom of screen
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(6);


        // group of enemies
        this.enemies = this.physics.add.group();

        function createEnemy() {
            const enemyPositionX = this.player.x + 600 * Math.cos(this.player.rotation + 50);
            const enemyPositionY = this.player.y + 600 * Math.sin(this.player.rotation + 50);
            const enemy = this.physics.add.image(enemyPositionX, enemyPositionY, 'player').setScale(1).setRotation(-Math.PI / 2);
            enemy.setCollideWorldBounds(true);
            enemy.body.setCircle(15, 10, 10);
            enemy.setAngularDrag(4000);
            enemy.setDrag(100);
            enemy.setMaxVelocity(70);
            enemy.setScale(0.5);
            this.enemies.add(enemy);
        }

        // periodically add enemies
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                createEnemy.call(this);
            },
            loop: true,
        });

        // every 1s, all enemies shoot bullets at player
        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.enemies.getChildren().forEach((enemy) => {
                    //  50% chance nothing happens
                    if (Math.random() < 0.2) {
                        return;
                    }

                    const bullet = this.add.circle(0, 0,10, 0xff0000);
                    this.physics.add.existing(bullet);
                    bullet.body.setCircle(10, -5, -5);
                    bullet.body.setAllowGravity(false);
                    bullet.setScale(0.3);
                    bullet.x = enemy.x;
                    bullet.y = enemy.y;
                    bullet.body.setVelocity(
                        10 * Math.cos(this.physics.moveToObject(bullet, this.player, 100)),
                        10 * Math.sin(this.physics.moveToObject(bullet, this.player, 100))
                    );



                    // remove debug graphics
                    bullet.body.debugShowBody = false;
                    bullet.body.debugShowVelocity = false;

                    // check for collision with player
                    this.physics.add.overlap(this.player, bullet, (player, bullet) => {
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
            delay: 800,
            callback: () => {
                // create white circle
                const bullet = this.add.circle(0, 0, 5, 0xffffff);
                this.physics.add.existing(bullet);
                bullet.body.setCircle(10, -5, -5);
                bullet.body.setAllowGravity(false);
                bullet.setScale(0.3);
                bullet.x = this.player.x + 0 * Math.cos(this.player.rotation);
                bullet.y = this.player.y + 0 * Math.sin(this.player.rotation);
                // current player speed
                bullet.body.setVelocity(
                    150 * Math.cos(this.player.rotation) + 150 * Math.cos(this.player.rotation),
                    150 * Math.sin(this.player.rotation) + 150 * Math.sin(this.player.rotation)
                );


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

        this.controlScheme = 'AD';

        // Create a new camera for the UI elements
        let UICamera = this.cameras.add(0, 0, 500, 200);

        // Add your text to this new camera
        this.text = this.add.text(0, 0, 'Control Scheme: ' + this.controlScheme, { font: '32px Arial', fill: '#ffffff' });

        // add button to switch control scheme
        this.button = this.add.text(0, 100, 'Switch Control Scheme', { font: '32px Arial', fill: '#ffffff' }).setInteractive();
        this.button.on('pointerdown', () => {
            this.controlScheme = this.controlScheme === 'AD' ? 'strafe' : 'AD';
            this.text.setText('Control Scheme: ' + this.controlScheme);
        });

        // camera ignores player and follows the UI
        UICamera.ignore(this.player);
        UICamera.ignore(this.enemies);

        //zoom uicamera
        UICamera.setZoom(1);
        
        // create crosshair (a dot that is 400px in front of player)
        this.crosshair = this.add.circle(this.player.x + 1 * Math.cos(this.player.rotation), this.player.y + 4 * Math.sin(this.player.rotation), 1, 0xffffff);



    }



    update() {
        //crosshair
        this.crosshair.x = this.player.x + 70 * Math.cos(this.player.rotation);
        this.crosshair.y = this.player.y + 70 * Math.sin(this.player.rotation);

        // check if any enemy is 100px near crosshair
        this.isLocked = false;
        this.enemies.getChildren().forEach((enemy) => {
            // this.isLocked = false;

            if (Phaser.Math.Distance.Between(this.crosshair.x, this.crosshair.y, enemy.x, enemy.y) < 50) {
                console.log('found enemy');
                this.isLocked = true;
                enemy.setTint(0xff0000);


                // Player bullets toward enemy
                this.children.list.forEach((bullet) => {
                    if (bullet.body && bullet.fillColor === 0xffffff) {
                        this.physics.moveToObject(bullet, enemy, 100);
                    }
                });
            } else {
                enemy.clearTint();

                // move crosshair back to player
                // this.physics.moveToObject(this.crosshair, this.player, 100);
                
            }
        });

        console.log('isLocked', this.isLocked)

        // this.controlScheme = this.isLocked ? 'strafe' : 'AD';
        this.controlScheme = 'AD';

        // move player based on control scheme
        if (this.controlScheme === 'AD') {
            console.log('AD');
            ADMovement.call(this);
        }
        else if (this.controlScheme === 'strafe') {
            console.log('strafe');
            strafeMovement.call(this);
        }

        function strafeMovement() {
            // strafe camera movement
            // const cameraRotation = this.player.rotation + Math.PI / 2;
            // this.cameras.main.setRotation(-cameraRotation);

            // player movement begins strafing with target
            this.player.x += this.playerSpeed * Math.cos(this.player.rotation);
            this.player.y += this.playerSpeed * Math.sin(this.player.rotation);

            // rotate via A/D keys or pointer
            const Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            const Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            const Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            const Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


            // move forward
            if (Wkey.isDown) {
                
            } else if (Skey.isDown) {
                
            } else {
                
            }

            // move left
            if (Akey.isDown || this.input.activePointer.isDown && this.input.activePointer.x < width / 2) {
                // move player left
                // this.player.x += this.playerSpeed * Math.cos(this.player.rotation - Math.PI / 2);
                // this.player.y += this.playerSpeed * Math.sin(this.player.rotation - Math.PI / 2);          
            }

            // move right
            if (Dkey.isDown || this.input.activePointer.isDown && this.input.activePointer.x > width / 2) {
                // this.player.x += this.playerSpeed * Math.cos(this.player.rotation + Math.PI / 2);
                // this.player.y += this.playerSpeed * Math.sin(this.player.rotation + Math.PI / 2);
                // strafe player right
                // this.player.x += this.playerSpeed * Math.cos(this.player.rotation + Math.PI / 2);
                // this.player.y += this.playerSpeed * Math.sin(this.player.rotation + Math.PI / 2);
            }


        }
        // ADMovement.call(this);
        function ADMovement() {
            // set camera rotation to player rotation
            const cameraRotation = this.player.rotation + Math.PI / 2;
            this.cameras.main.setRotation(-cameraRotation);

            // offset player rotation by 90 degrees
            this.player.rotation = this.player.rotation + Math.PI / 2;

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
                this.playerSpeed > 1 ? this.playerSpeed -= 0.001 : this.playerSpeed += 0.01;
            }
            this.player.x += this.playerSpeed * Math.cos(this.player.rotation);
            this.player.y += this.playerSpeed * Math.sin(this.player.rotation);

            // rotate via A/D keys or pointer
            if (Akey.isDown || this.input.activePointer.isDown && this.input.activePointer.x < width / 2) {
                this.player.setAngularVelocity(
                    this.player.body.angularVelocity - 1.5
                );
            } else if (Dkey.isDown || this.input.activePointer.isDown && this.input.activePointer.x > width / 2) {
                this.player.setAngularVelocity(
                    this.player.body.angularVelocity + 1.5
                );
            } else {
                // set angular velocity closer to 0
                this.player.setAngularVelocity(
                    this.player.body.angularVelocity * 0.95
                );
            }


        }

        // move enemies toward player
        this.enemies.getChildren().forEach((enemy) => {
            this.physics.moveToObject(enemy, this.player, 40);
        });

        // leave a temporary blue trail
        const trail = this.add.circle(this.player.x, this.player.y, 5, 0x0000ff);
        trail.depth = -1;

        // make trail get progressively smaller
        this.time.addEvent({
            delay: 100,
            callback: () => {
                trail.setScale(trail.scaleX - 0.1);
                if (trail.scaleX <= 0) {
                    trail.destroy();
                }
            },
            repeat: 10,
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
