class Example extends Phaser.Scene {
    preload() {
        this.load.image('ball', 'assets/bike.png');
    }

    create() {
        // Create an array to hold ground segments
        this.groundSegments = [];

        // Create initial ground segments (adjust as needed)
        for (let i = 0; i < 3; i++) {
            const groundWidth = this.cameras.main.width;
            const groundHeight = 100;
            const groundX = i * groundWidth; // Position each segment horizontally
            const groundY = this.cameras.main.height + groundHeight; // Position each segment at the bottom of the screen
            // make the ground segments origin point top left
            const groundRect = this.add.rectangle(groundX, groundY, groundWidth, groundHeight, 0x00ff00)
                .setOrigin(0, 0)
                .setAngle(Phaser.Math.Between(0, 360));
            
            this.matter.add.gameObject(groundRect, { isStatic: true });

            // Add the segment to the array
            this.groundSegments.push(groundRect);
        }

        // Set the camera on the player (ball)
        this.ball = this.matter.add.image(150, 150, 'ball');
        this.ball.setScale(0.1);
        this.ball.setFlipX(true);
        this.ball.setFriction(0);
        this.ball.setVelocityX(12);
        this.ball.setBounce(0.6);
        this.ball.setMass(100);
        this.cameras.main.startFollow(this.ball);
    }

    update() {
        // Scroll the ground segments to the left
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
