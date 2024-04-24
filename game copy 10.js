class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/triangle.png');
    }

    /*

                MODIFIERY

    */


    create() {
        // Create player
        this.player = this.physics.add.image(400, 300, 'player');
        this.player.defaultSpeed = 160;
        this.player.speed = this.player.defaultSpeed;

        // give player hitbox
        this.physics.add.existing(this.player, true);

        // Set player speed
        this.player.setDamping(true);
        this.player.setDrag(0.99);
        this.player.setMaxVelocity(200);




        this.player.isDropping = false;
        // on click, set player to drop
        this.input.on('pointerdown', () => {
            this.player.isDropping = !this.player.isDropping;
            // change color of player
            this.player.setTint(this.player.isDropping ? 0xff0000 : 0xffffff);
        });

        // Enable WASD controls
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Set camera to follow player
        this.cameras.main.startFollow(this.player);

        // Generate "infinite" world
        this.worldSize = 10;
        this.world = generateWorld(this.worldSize);
        this.tileSize = 300;
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

        // Set world bounds
        this.physics.world.setBounds(0, 0, this.worldSize * this.tileSize, this.worldSize * this.tileSize);

        // // When player overlaps a tile
        // this.physics.add.overlap(this.player, this.tiles, (player, tile) => {
        //     // Set player speed to tile speed
        //     player.speed = tile.speed;
        //     console.log('Player speed:', player.speed);
        // });

        // Set camera bounds
        this.cameras.main.setBounds(0, 0, this.worldSize * this.tileSize, this.worldSize * this.tileSize);

        // create enemy at random position near player
        this.enemies = [];



        // zoom camera on player
        this.cameras.main.setZoom(3);

        // every 2 seconds,
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => {
                if (this.player.isDropping) {

                    // get player coords
                    let x = this.player.x;
                    let y = this.player.y;

                    // show attack hitbox around player (300px radius)
                    let decoration = this.add.circle(x, y, 10, 0xff0000, 0.5);

                    this.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            // remove decoration
                            decoration.destroy();
                            let hitbox = this.add.circle(x, y, 50, 0xff0000, 0.5);

                            this.physics.add.existing(hitbox, true);

                            // When an enemy collides with hitbox
                            this.physics.add.overlap(hitbox, this.enemies, (hitbox, enemy) => {
                                console.log('Enemy hit by player');
                                console.log('total enemies:', this.enemies.length);
                                enemy.destroy();
                                this.enemies = this.enemies.filter(e => e !== enemy);
                                console.log('total enemies:', this.enemies.length);
                            });

                            // this.physics.add.overlap(hitbox, this.enemies, (hitbox, enemy) => {
                            //     console.log('Enemy hit by player');
                            //     console.log('total enemies:', this.enemies.length);
                            //     enemy.destroy();
                            //     this.enemies = this.enemies.filter(e => e !== enemy);
                            //     console.log('total enemies:', this.enemies.length);
                            // });

                            // after 50ms, remove hitbox
                            this.time.addEvent({
                                delay: 50,
                                callback: () => {
                                    hitbox.destroy();
                                }
                            });
                        }
                    });
                } else {

                }

            }
        });
    }


    update() {
        if (this.cursors.up.isDown)
        {
            this.physics.velocityFromRotation(this.player.rotation, 200, this.player.body.acceleration);
        }
        else
        {
            this.player.setAcceleration(0);
        }

        if (this.cursors.left.isDown)
        {
            this.player.setAngularVelocity(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setAngularVelocity(300);
        }
        else
        {
            this.player.setAngularVelocity(0);
        }

        this.enemies.forEach(enemy => {
            // reset enemy speed
            enemy.speed = enemy.defaultSpeed;

            // slow enemy on tiles
            this.physics.overlap(enemy, this.tiles, (enemy, tile) => {
                enemy.speed = enemy.defaultSpeed * tile.speedModifier;
            });

            // move enemy toward player
            this.physics.moveToObject(enemy, this.player, enemy.speed);
        });

        // set player speed
        this.player.speed = this.player.defaultSpeed;
        // slow player on tiles
        this.physics.overlap(this.player, this.tiles, (player, tile) => {
            player.speed = player.defaultSpeed * tile.speedModifier;
        });

        // if less than 3 enemies, add one near player
        if (this.enemies.length < 3) {
            let x = Phaser.Math.Between(this.player.x - 300, this.player.x + 300);
            let y = Phaser.Math.Between(this.player.y - 300, this.player.y + 300);
            createEnemy.call(this, x, y);
        }
    }
}

function createEnemy(x, y) {
    console.log('creating enemy');
    let enemy = this.physics.add.sprite(x, y, 'enemy');
    enemy.defaultSpeed = 100;
    enemy.speed = enemy.defaultSpeed;
    this.enemies.push(enemy);

    // give enemy hitbox
    this.physics.add.existing(enemy, true);


    // When enemy collides with player
    this.physics.add.collider(enemy, this.player, () => {
        console.log('Player hit by enemy');
        this.scene.restart();
    });
}

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
