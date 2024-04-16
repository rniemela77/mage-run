class Demo extends Phaser.Scene {
    preload() {
    }

    create() {
        this.laneWidth = 300;
        this.laneHeight = 900;
        this.level = 1;

        // create text for level
        this.levelText = this.add.text(-100, -100, 'LVL: ' + this.level, { fontSize: '12px', fill: '#000' });
        
        // no gravity
        this.physics.world.gravity.y = 0;

        // Set world bounds
        this.physics.world.setBounds(0, 0, this.laneWidth, this.laneHeight);

        // Create world bounds rectangle
        this.add.rectangle(0, 0, this.laneWidth, this.laneHeight, 0x004d00).setOrigin(0, 0);

        // Create player
        this.player = this.add.circle(150, this.laneHeight, 20, 0x00ff00);
        this.physics.add.existing(this.player, Phaser.Physics.Arcade.RADIUS);
        this.player.body.setCircle(20);
        this.player.body.collideWorldBounds = true;
        this.player.depth = 1;

        // set camera on player
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        // zoom the camera
        this.cameras.main.setZoom(3);

        // Create spawn point (blue)
        this.add.rectangle(0, this.laneHeight - 100, this.laneWidth, 100, 0x0000ff).setOrigin(0, 0);

        // Create checkpoint (gold). Player must reach this to level up
        this.checkpoint = this.add.rectangle(0, 0, this.laneWidth, 100, 0xffd700);
        this.physics.add.existing(this.checkpoint);
        this.checkpoint.body.setOffset(0, this.laneHeight - 100);
        this.checkpoint.body.setSize(this.laneWidth, 100);
        this.checkpoint.body.collideWorldBounds = true;

        // mouse click to move player
        this.input.on('pointerdown', (pointer) => {
            var pointerWorld = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            this.physics.moveTo(this.player, pointerWorld.x, pointerWorld.y, 200);
        });


        // Create enemies
        this.enemies = [];
        for (let i = 0; i < this.level; i++) {
            // find a random position within the lane
            const randomPosition = () => Phaser.Math.Between(0, this.laneHeight);
            const x = randomPosition();
            const y = randomPosition();
            this.createEnemy(x, y);
        }


        // when player reaches checkpoint
        this.physics.add.collider(this.player, this.checkpoint, () => {
            console.log('checkpoint reached')
            this.level++;
            this.resetPlayerPosition();
            this.enemies.forEach(enemy => enemy.destroy());
            this.enemies = [];
            this.createEnemies(this.level);
        });
    }

    resetPlayerPosition() {
        this.player.x = 150;
        this.player.y = this.laneHeight + 50;
    }

    createEnemies(n) {
        for (let i = 0; i < n; i++) {
            // find a random position within the lane
            const randomPosition = () => Phaser.Math.Between(0, this.laneHeight);
            const x = randomPosition();
            const y = randomPosition();
            this.createEnemy(x, y);
        }
    }

    createEnemy(x, y) {
        const enemySize = 25 + (this.level * 5);
        let enemy = this.add.circle(x, y, enemySize, 0xff0000);
        this.physics.add.existing(enemy, Phaser.Physics.Arcade.RADIUS);
        enemy.body.setCircle(enemySize);
        enemy.body.collideWorldBounds = true;

        enemy.resetEnemyDirection = () => {
            if (!enemy.active) {
                return;
            }

            if (Phaser.Math.Between(0, 1) === 1) {
                // Stop the enemy
                enemy.body.setVelocity(0, 0);
            } else {
                // Set a random velocity
                enemy.body.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));

                // Make it bounce off of world bounds
                enemy.body.setBounce(1, 1);

                // make it bound off other enemies
                this.physics.add.collider(this.enemies, enemy, () => {
                    enemy.body.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
                });
            }
        }

        enemy.resetEnemyDirection();

        this.time.addEvent({
            delay: Phaser.Math.Between(250, 1500),
            callback: enemy.resetEnemyDirection,
            loop: true,
        });

        this.enemies.push(enemy);

        // set bounds for enemy
        enemy.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 100, this.laneWidth, this.laneHeight - 200));

        // Collide player with enemies
        this.physics.add.collider(this.enemies, this.player, () => {
            this.resetPlayerPosition();
        });
    }

    update() {
        const speed = 2;

        if (this.input.keyboard.addKey('W').isDown) {
            this.player.y -= speed;
            this.player.body.setVelocity(0, 0);
        }
        if (this.input.keyboard.addKey('S').isDown) {
            this.player.y += speed;
            this.player.body.setVelocity(0, 0);
        }
        if (this.input.keyboard.addKey('A').isDown) {
            this.player.x -= speed;
            this.player.body.setVelocity(0, 0);
        }
        if (this.input.keyboard.addKey('D').isDown) {
            this.player.x += speed;
            this.player.body.setVelocity(0, 0);
        }

        // align levelText to player center
        this.levelText.x = this.player.x - 25;
        this.levelText.y = this.player.y;
        
        this.levelText.setText('LVL: ' + this.level);
        // place above everything
        this.levelText.depth = 2;
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
