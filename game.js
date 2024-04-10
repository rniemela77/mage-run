class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('platform', 'assets/demoscene/sunset-raster.png');
        this.load.image('lemming', 'assets/sprites/lemming.png');
    }

    create() {
        function resetPlayer() {
            this.player.x = 300;
            this.player.y = 0;
            this.player.body.velocity.x = 200;
            this.player.body.velocity.y = -100;
        }
        // player (blue)
        this.player = this.add.rectangle(300, 0, 50, 50, 0x0000ff);
        this.physics.add.existing(this.player);
        this.player.body.setDragY(100);
        resetPlayer.call(this);

        // reset button
        this.resetBtn = this.add.rectangle(0, 0, 200, 100, 0x0000ff);
        this.resetBtn.setInteractive();
        this.resetBtn.setOrigin(0, 0);
        this.resetBtn.setScrollFactor(0);
        this.resetBtn.on('pointerdown', resetPlayer.bind(this));

        this.canJump = false;
        this.huggingLeft = false;
        this.huggingRight = false;

        // camera on player
        this.cameras.main.startFollow(this.player, true);

        // generate platforms
        for (let i = 0; i < 16; i++) {
            const platform = this.add.rectangle(250, 0, 100, 1000, 0x00ff00);
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.moves = false;
            // place platforms progressively higher
            platform.setPosition(i % 2 === 0 ? 200 : 500, 200 * -i);

            // add collision
            this.physics.add.collider(this.player, platform);
        }


        // generate enemies
        for (let i = 0; i < 16; i++) {
            const enemy = this.add.rectangle(250, 0, 50, 50, 0xff6666);
            this.physics.add.existing(enemy);
            enemy.body.setImmovable(true);
            enemy.body.moves = false;
            enemy.setPosition(i % 2 === 0 ? 250 : 450, 200 * -i);
        }

        // if player collides with enemy
        this.physics.add.collider(this.player, this.children.list.filter(child => child.fillColor === 0xff6666), (player, enemy) => {
            this.player.body.velocity.y = 0;
            this.player.fillColor = 0x000000;
        });

        // create a jump btn (bottom right)
        this.jumpBtn = this.add.rectangle(800, 600, 100, 100, 0xff0000);
        this.jumpBtn.setInteractive();
        this.jumpBtn.setOrigin(1, 1);
        this.jumpBtn.setScrollFactor(0);
        // align to bottom right
        this.jumpBtn.x = this.cameras.main.width;
        this.jumpBtn.y = this.cameras.main.height;

        // create a fire btn (yellow)
        this.button = this.add.rectangle(700, 600, 100, 100, 0xffff00);
        this.button.setInteractive();
        this.button.setOrigin(1, 1);
        this.button.setScrollFactor(0);
        this.button.x = this.cameras.main.width - 100;
        this.button.y = this.cameras.main.height;

        // fire btn cooldown
        this.fireBtnCooldown = 3000;

        //  fire button
        this.button.on('pointerdown', () => {
            // if firebtn is on cooldown, return
            if (this.fireBtnCooldown > 0) {
                return;
            }
            this.fireBtnCooldown = 3000;

            const effect = this.add.rectangle(this.player.x, this.player.y, 20, 10, 0xffff00);
            this.physics.add.existing(effect); // Add physics to the effect
            // make it expand horizontally
            this.tweens.add({
                targets: effect,
                scaleX: 30,
                scaleY: 0.5,
                duration: 300,
                ease: 'Cubic.easeOut',

                onComplete: () => {
                    effect.destroy();
                }
            });
            effect.body.setAllowGravity(false);

            // if effect touches enemy
            this.physics.add.collider(effect, this.children.list.filter(child => child.fillColor === 0xff6666), (effect, enemy) => {
                effect.destroy();
                enemy.destroy();
            });
        });

        // alt fire btn
        this.altFireBtn = this.add.rectangle(600, 600, 100, 100, 0x00ff00);
        this.altFireBtn.setInteractive();
        this.altFireBtn.setOrigin(1, 1);
        this.altFireBtn.setScrollFactor(0);
        this.altFireBtn.x = this.cameras.main.width - 200;
        this.altFireBtn.y = this.cameras.main.height;

        // alt fire btn cooldown
        this.altFireBtnCooldown = 3000;

        //  alt fire button
        this.altFireBtn.on('pointerdown', () => {
            // if alt firebtn is on cooldown, return
            if (this.altFireBtnCooldown > 0) {
                return;
            }
            this.altFireBtnCooldown = 3000;

            // pink
            const effect = this.add.rectangle(this.player.x, this.player.y, 10, 200, 0xff00ff);
            this.physics.add.existing(effect); // Add physics to the effect
            effect.setOrigin(this.huggingLeft ? 0 : 1, 0.5);
            effect.setOrigin(this.player.body.velocity.x > 0 ? 0 : 1, 0.5);
            
            // make it expand horizontally
            this.tweens.add({
                targets: effect,
                scaleX: 30,
                duration: 300,
                ease: 'Cubic.easeOut',

                onComplete: () => {
                    effect.destroy();
                }
            });
            effect.body.setAllowGravity(false);

            // if effect touches enemy
            this.physics.add.collider(effect, this.children.list.filter(child => child.fillColor === 0xff6666), (effect, enemy) => {
                effect.destroy();
                enemy.destroy();
            });
        });
    }

    update() {
        if (this.player.body.touching.left) {
            this.huggingLeft = true;
        }
        if (this.player.body.touching.right) {
            this.huggingRight = true;
        }

        if (this.huggingLeft || this.huggingRight) {
            this.canJump = true;
        }

        // update firebtncooldown
        this.fireBtnCooldown = Math.max(0, this.fireBtnCooldown - 16.666666666666668);

        // update altfirebtncooldown
        this.altFireBtnCooldown = Math.max(0, this.altFireBtnCooldown - 16.666666666666668);

        // if firebtn is on cooldown, make it grey. otherwise make it yellow.
        this.button.fillColor = this.fireBtnCooldown > 0 ? 0x666666 : 0xffff00;

        // if altfirebtn is on cooldown, make it grey. otherwise make it pink
        this.altFireBtn.fillColor = this.altFireBtnCooldown > 0 ? 0x666666 : 0xff00ff;

        // if canjump, make jump button white. else, make it grey
        this.jumpBtn.fillColor = this.canJump ? 0xffffff : 0x666666;

        // an 5 color array of the gradient of blue
        const colors = [0x0000ff, 0x3333ff, 0x6666ff, 0x9999ff, 0xccccff];

        // the color of the player is the blue color that matches how long the jump is held
        this.player.fillColor = colors[Math.min(4, Math.floor(this.input.activePointer.getDuration() / 100))];
        if (!this.input.activePointer.isDown) {
            this.player.fillColor = 0x0000ff;
        }

        //  jump btn (hold to jump higher)
        this.jumpBtn.on('pointerup', () => {
            // jump velocity depends on how long the jump button was held (between 0 and 500)
            const maxVelocity = 500;
            const minVelocity = 150;
            const jumpVelocity = Math.min(maxVelocity, Math.max(minVelocity, this.input.activePointer.getDuration() * 2));
            // const jumpVelocity = Math.min(500, this.input.activePointer.getDuration() * 2);

            if (this.huggingLeft) {
                this.player.body.velocity.x = jumpVelocity;
            }
            if (this.huggingRight) {
                this.player.body.velocity.x = -jumpVelocity;
            }

            if (this.canJump) {
                this.player.body.velocity.y = -jumpVelocity;
            }

            this.canJump = false;
            this.huggingLeft = false;
            this.huggingRight = false;
        });

    }
}


const config = {
    type: Phaser.AUTO,
    // scren width
    width: this.innerWidth,
    height: this.innerHeight,
    parent: 'phaser-example',
    physics: {
        default: 'arcade', 
        arcade: {
            debug: true,
            gravity: {
                y: 200,
            }
        }
    },
    scene: [
        GameScene,
    ],
};

const game = new Phaser.Game(config);
