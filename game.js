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
        this.player.setOrigin(0.5, 0.5);
        this.player.defaultSpeed = 160;
        this.player.speed = this.player.defaultSpeed;

        // give player hitbox
        this.physics.add.existing(this.player, true);
        this.player.body.setCircle(15, 10, 10);

        this.player.fireMode = 0;
        // on click, set player to drop
        this.input.on('pointerdown', () => {
            (this.player.fireMode < 4) ? this.player.fireMode += 1 : this.player.fireMode = 0;
            // change color of player
            this.player.setTint(this.player.isDropping ? 0xff0000 : 0xffffff);
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

        // Set camera bounds
        this.cameras.main.setBounds(0, 0, this.worldSize * this.tileSize, this.worldSize * this.tileSize);

        // create enemy at random position near player
        this.enemies = [];



        // zoom camera on player
        this.cameras.main.setZoom(3);

        // every 2 seconds,
        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                if (this.player.fireMode === 0) {
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
                                enemy.destroy();
                                this.enemies = this.enemies.filter(e => e !== enemy);
                            });

                            // after 50ms, remove hitbox
                            this.time.addEvent({
                                delay: 50,
                                callback: () => {
                                    hitbox.destroy();
                                }
                            });
                        }
                    });
                } else if (this.player.fireMode === 1){
                    // create bullet
                    let bullet = this.add.circle(this.player.x, this.player.y, 5, 0xff0000, 0.5);
                    // debug color black
                    bullet.debugColor = 0x000000;
                    

                    this.physics.add.existing(bullet, false);

                    // move bullet toward closest enemy
                    let closestEnemy = this.enemies.reduce((closest, enemy) => {
                        let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                        if (distance < closest.distance) {
                            return { enemy, distance };
                        }
                        return closest;
                    }, { enemy: null, distance: Infinity }).enemy;

                    if (closestEnemy) {
                        this.physics.moveToObject(bullet, closestEnemy, 300);
                    } else {
                        this.physics.moveTo(bullet, this.player.x, this.player.y, 300);
                    }



                    
                    // When an enemy collides with hitbox
                    this.physics.add.overlap(bullet, this.enemies, (bullet, enemy) => {
                        enemy.destroy();
                        this.enemies = this.enemies.filter(e => e !== enemy);
                    });


                    // delete after 0.5s
                    this.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            bullet.destroy();
                        }
                    });
                } else if (this.player.fireMode === 2) {
                    // create circle on player
                    let circle = this.add.circle(this.player.x, this.player.y, 50, 0xff0000, 0.5);
                    this.physics.add.existing(circle, true);

                    // When an enemy collides with hitbox
                    this.physics.add.overlap(circle, this.enemies, (circle, enemy) => {
                        enemy.destroy();
                        this.enemies = this.enemies.filter(e => e !== enemy);
                    });

                    // after 50ms, remove hitbox
                    this.time.addEvent({
                        delay: 50,
                        callback: () => {
                            circle.destroy();
                        }
                    });
                }
            }
        });
    }


    update() {
        //find user pointer
        let pointer = this.input.activePointer;


        // find where user clicked (camera zoomed in)
        let x = pointer.x + this.cameras.main.scrollX;
        let y = pointer.y + this.cameras.main.scrollY;

        // move player to where user clicked
        this.physics.moveTo(this.player, x, y, this.player.speed);

        // angle
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, x, y);
        this.player.setRotation(angle);


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
