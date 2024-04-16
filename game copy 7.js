class Demo extends Phaser.Scene {
    preload() {
    }

    create() {
        // create player square
        this.player = this.add.rectangle(400, 300, 50, 50, 0x0000ff);
        this.physics.add.existing(this.player);

        // create gravity well
        this.gravityWell = this.add.circle(400, 100, 300, 0xff0000);
        this.physics.add.existing(this.gravityWell);
        this.gravityWell.body.setCircle(125);

        
        this.gravityWell.body.velocity.y = 100;

        // center camera on player
        // this.cameras.main.startFollow(this.player);

        // arrow keys move player on X axis
        this.cursors = this.input.keyboard.createCursorKeys();

        // pressing an arrow key will slightly modify the player's X velocity
        this.playerSpeed = 10;

        // place camera on player 
        this.cameras.main.startFollow(this.player);


    }

    update() {
        // player slides after letting go
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= this.playerSpeed;

            // if it's away from the gravity well
            if (this.player.x > this.gravityWell.x) {
                // make the well black
                this.gravityWell.fillColor = 0x000000;
            }
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += this.playerSpeed;
        } else {
            // if no button is held, slow down the player
            this.player.body.velocity.x *= 0.999;
        }

        // if the player is moving in the opposite direction of the gravity well, make the well grow
        const direction = this.player.x - this.gravityWell.x;
        const amount = Math.abs(direction) / 1000;

        this.gravityWell.radius = amount * 300;
        this.gravityWell.body.setCircle(amount * 300);

        // this.gravityWell.radius = distance / amount;
        // this.gravityWell.body.setCircle(distance / amount);





        // if well is off screen, wrap around
        if (this.gravityWell.y > 600) {
            this.gravityWell.y = 0;
        }
        
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
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