class Example extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/bike.png');
    }

    create() {
        this.playerSpeed = 5;

        // Ground
        const ground = this.add.rectangle(0, 300, 800, 100, 0x00ff00);
        this.matter.add.gameObject(ground, { isStatic: true });

        // Ramp
        const ramp = this.add.rectangle(100, 280, 100, 100, 0xff0000);
        this.matter.add.gameObject(ramp, { isStatic: true });
        ramp.angle = 55;
        this.ramp = ramp;

        // Player
        this.player = this.matter.add.image(0, 150, 'player');
        this.player.setScale(0.1);
        this.player.setFlipX(true);
        this.player.setFriction(0);
        this.player.setBounce(0.6);
        this.player.setMass(10);
        this.player.setCircle(30);
        this.player.setOrigin(0.5, 0.4);
        this.player.setFixedRotation();

        // Player collide with ramp
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                if (bodyA.gameObject === this.player || bodyB.gameObject === this.player) {
                    // if player and ramp
                    if (bodyA.gameObject === this.ramp || bodyB.gameObject === this.ramp) {
                        

                        // set angle
                        this.player.setAngle(-25);

                        // if mouse down
                        if (this.input.activePointer.isDown) {
                            this.player.setVelocityY(-4);
                            // change gravity
                            this.matter.world.setGravity(0, 0.1);
                        }
                    }

                    //if player and ground
                    if (bodyA.gameObject === ground || bodyB.gameObject === ground) {
                        this.player.setAngle(0);
                        // reset gravity
                        this.matter.world.setGravity(0, 0.5);
                    }
                }
            });
        });

        // if player is in air and clicks mouse
        this.input.on('pointerdown', () => {
            const isPlayerOnGround = this.player.y > 150;
            if (!isPlayerOnGround) {
                // show effect under player that travels downward
                const effect = this.add.rectangle(this.player.x, this.player.y + 50, 30, 80, 0xff0000);
                this.tweens.add({
                    targets: effect,
                    y: this.player.y + 70,
                    duration: 300,
                    onComplete: () => {
                        effect.destroy();
                    }
                });
            }
        });
        
        this.cameras.main.startFollow(this.player);
    }

    update() {
        // make the ramp move from right to left
        this.ramp.x -= 5;

        // when it goes out of the screen, reset the position
        if (this.ramp.x < -300) {
            this.ramp.x = 900;
        }

        // when 
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.5 },
            debug: true,
        },
    },
    scene: Example,
};

const game = new Phaser.Game(config);
