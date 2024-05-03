// enemy.js
class Movement {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.crosshair = scene.crosshair;
        this.player = scene.player;
        this.time = scene.time;
        this.player = scene.player;
        this.input = scene.input;
        this.width = scene.width;
        this.height = scene.height;

        this.sharpTurn();
        // this.drifting();
    }

    sharpTurn() {
        const Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        let speed = 0;
        const player = this.player.sprite();

        this.scene.events.on('update', () => {
            if (Wkey.isDown) {
                speed < 2 ? speed += 0.03 : speed = 2;
            } else if (Skey.isDown) {
                speed > -2 ? speed -= 0.03 : speed = -2;
            }

            // move forward
            // velocity
            player.setVelocity(speed * 100 * Math.cos(player.rotation), speed * 100 * Math.sin(player.rotation));
            // player.x += speed * Math.cos(player.rotation);
            // player.y += speed * Math.sin(player.rotation);

            // rotate via A/D keys or pointer
            if (Akey.isDown || this.input.activePointer.isDown && this.input.activePointer.x < this.width / 2) {
                player.rotation -= 0.015;
            } else if (Dkey.isDown || this.input.activePointer.isDown && this.input.activePointer.x > this.width / 2) {
                player.rotation += 0.015;
            }
        });
    }

    drifting() {
        this.player.speed = 100;
        let player = this.player.sprite();
        player.speed = 100;

        let direction = 0;
        const rotationSpeed = 50;
        const rotationSlowdown = 0.9;

        this.scene.events.on('update', () => {
            // if holding w, move forward
            if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
                player.speed += 1;
            } else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
                player.speed -= 1;
            }

            // move player forward
            player.setVelocity(player.speed * Math.cos(direction), player.speed * Math.sin(direction));

            // velocity drag
            player.setDrag(0);


            // if holding down A or D, rotate
            if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
                // tap A to rotate left
                player.setAngularVelocity(
                    -rotationSpeed
                );
                this.scene.effects.blackTrail();
            } else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
                // tap D to rotate right
                player.setAngularVelocity(
                    rotationSpeed
                );
                this.scene.effects.blackTrail();
            } else {
                direction = player.rotation;
                player.setAngularVelocity(
                    player.body.angularVelocity * rotationSlowdown
                );
            }
        });
    }

}

export default Movement;