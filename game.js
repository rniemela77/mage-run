class Example extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/bike.png');
    }

    create() {
        this.playerSpeed = 5;
        // Create an array to hold ground segments
        this.groundSegments = [];

        for (let i = 0; i < 3; i++) {
            const groundWidth = this.cameras.main.width;
            const groundHeight = 100;
            const groundX = i * groundWidth; // Position each segment horizontally
            const groundY = this.cameras.main.height + groundHeight; // Position each segment at the bottom of the screen
            // make the ground segments origin point top left
            const groundRect = this.add.rectangle(groundX, groundY, groundWidth, groundHeight, 0x00ff00);

            this.matter.add.gameObject(groundRect, { isStatic: true });

            // Add the segment to the array
            this.groundSegments.push(groundRect);
        }

        const ramp = this.add.rectangle(0, 670, 100, 100, 0xff0000);
        this.matter.add.gameObject(ramp, { isStatic: true });
        ramp.angle = 55;
        this.ramp = ramp;

        this.player = this.matter.add.image(150, 150, 'player');
        this.player.setScale(0.1);
        this.player.setFlipX(true);
        this.player.setFriction(0);
        this.player.setBounce(0.6);
        this.player.setMass(10);
        this.player.setCircle(30);
        this.player.setOrigin(0.5, 0.4);
        this.player.setFixedRotation();

        // if the player is touching the ramp, rotate the player.
        // if the player is touching the ground, reset the player angle
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                if (bodyA.gameObject === this.player || bodyB.gameObject === this.player) {
                    if (bodyA.gameObject === this.ramp || bodyB.gameObject === this.ramp) {
                        this.player.setAngle(-25);
                    } else {
                        this.player.setAngle(0);
                    }
                }
            });
        });

        // if the player is touching the ramp, increase the player speed
        // if the player is touching the ground, reset the player speed
        this.matter.world.on('collisionactive', (event) => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                if (bodyA.gameObject === this.player || bodyB.gameObject === this.player) {
                    if (bodyA.gameObject === this.ramp || bodyB.gameObject === this.ramp) {
                        this.playerSpeed = 7;
                    } else {
                        this.playerSpeed = 5;
                    }
                }
            });
        });

        this.cameras.main.startFollow(this.player);
    }

    update() {
        // Move the ground segments to the left
        this.groundSegments.forEach(segment => {
            segment.x -= this.playerSpeed;
        });
        // Check if the first ground segment is out of view
        const firstSegment = this.groundSegments[0];
        if (firstSegment.getBounds().right < 0) {
            // If it is, reposition it to the right of the last segment
            const lastSegment = this.groundSegments[this.groundSegments.length - 1];
            firstSegment.x = lastSegment.getBounds().right;
            // Move the repositioned segment to the end of the array
            this.groundSegments.shift();
            this.groundSegments.push(firstSegment);
        }


        this.ramp.x -= this.playerSpeed;

        // every 3 sec, reset ramp position
        if (this.ramp.x < -100) {
            this.ramp.x = 800;
        }
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
