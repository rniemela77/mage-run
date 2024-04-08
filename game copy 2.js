class Example extends Phaser.Scene {
    ball;

    preload() {
        this.load.image('ball', 'assets/bike.png');
        this.load.image('platform', 'assets/triangle.png');
    }

    create() {
        this.ball = this.matter.add.image(150, 150, 'ball');
        // this.ball.setCircle();
        this.ball.setScale(0.1);
        // horizontally flip
        this.ball.setFlipX(true);
        
        // make the ball very slippery
        this.ball.setFriction(-0.001);

        // make the ball heavy
        this.ball.setMass(100);

        // create a bright platform
        const path = '0 0 0 100 600 100 100 50 0 0';
        const verts = this.matter.verts.fromPath(path);
        this.matter.add.fromVertices(180, 492, verts, {
            isStatic: true,
            ignoreGravity: true,
            fillStyle: 0x0000ff,
        }, true, 0.01, 10);
    }

    update() {
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.5 },
            debug: true
        }
    },
    scene: Example
};

const game = new Phaser.Game(config);