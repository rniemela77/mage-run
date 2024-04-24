class Demo extends Phaser.Scene {
    preload() {
        this.load.image('plane', 'assets/triangle3.png');
        // rotate by 90deg

    }

    /*

                MODIFIERY

    */



    create() {
        // create player (rotated 90deg)
        this.sprite = this.physics.add.image(400, 300, 'plane');
        // player has hitbox
        this.sprite.setCircle(14, 10, 17.5);
        // scale
        // this.sprite.setScale(0.5);

        // player scale


        // zoom the camera
        this.cameras.main.setZoom(3);
        // on player
        this.cameras.main.startFollow(this.sprite, true, 0.1, 0.1);



        this.sprite.setDamping(true);
        this.sprite.setDrag(0.99);
        this.sprite.setMaxVelocity(200);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });


        // function setAngularVelocityFlight() {
        //     this.plane = this.physics.add.image(400, 300, 'plane')
        //         .setCircle(24, 0, 7.5)
        //         .setVelocity(0, -100);

        //     this.input.keyboard
        //         .on('keydown-LEFT', () => { this.plane.setAngularVelocity(-60); })
        //         .on('keydown-RIGHT', () => { this.plane.setAngularVelocity(60); })
        //         .on('keydown-UP', () => { this.plane.setAngularVelocity(0); });
        // }

        // setAngularVelocityFlight();

        function generateWorld(size) {
            // Generate a simple world of size x size tiles
            let world = [];
            for (let y = 0; y < size; y++) {
                let row = [];
                for (let x = 0; x < size; x++) {
                    row.push(Math.random() > 0.8 ? 1 : 0);
                }
                world.push(row);
            }
            return world;
        }



        // Generate "infinite" world
        this.worldSize = 100;
        this.world = generateWorld(this.worldSize);
        this.tileSize = 100;
        this.tiles = this.add.group();
        for (let y = 0; y < this.worldSize; y++) {
            for (let x = 0; x < this.worldSize; x++) {
                if (this.world[y][x] === 1) {
                    // Create a black rectangle for each tile
                    let tile = this.add.rectangle(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize, 0x000000);

                    tile.speedModifier = 0.5;
                    // make tile overlappable
                    this.physics.add.existing(tile, true);

                    this.tiles.add(tile);
                }
            }
        }
    }

    update() {
        // setangularvelocityflight();
        // this.physics.velocityFromAngle(this.plane.angle, 150, this.plane.body.velocity);

        if (this.cursors.up.isDown) {
            console.log(this.sprite.rotation);
            this.physics.velocityFromRotation(this.sprite.rotation - 1.6, 100, this.sprite.body.acceleration);
        }
        else {
            this.sprite.setAcceleration(0);
        }

        if (this.cursors.left.isDown) {
            this.sprite.setAngularVelocity(-300);
        }
        else if (this.cursors.right.isDown) {
            this.sprite.setAngularVelocity(300);
        }
        else {
            this.sprite.setAngularVelocity(0);
        }

        this.text.setText(`Speed: ${this.sprite.body.speed}`);

        this.physics.world.wrap(this.sprite, 32);

        // sprite faces direction

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
