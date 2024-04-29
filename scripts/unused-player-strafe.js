/*
    unused: player strafe camera/movement
*/

function strafeMovement() {
    // strafe camera movement
    const cameraRotation = this.player.rotation + Math.PI / 2;
    this.cameras.main.setRotation(-cameraRotation);

    // player movement begins strafing with target
    this.player.x += this.playerSpeed * Math.cos(this.player.rotation);
    this.player.y += this.playerSpeed * Math.sin(this.player.rotation);

    // rotate via A/D keys or pointer
    const Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


    // move forward
    if (Wkey.isDown) {

    } else if (Skey.isDown) {

    } else {

    }

    // move left
    if (Akey.isDown || this.input.activePointer.isDown && this.input.activePointer.x < width / 2) {
        // move player left
        // this.player.x += this.playerSpeed * Math.cos(this.player.rotation - Math.PI / 2);
        // this.player.y += this.playerSpeed * Math.sin(this.player.rotation - Math.PI / 2);          
    }

    // move right
    if (Dkey.isDown || this.input.activePointer.isDown && this.input.activePointer.x > width / 2) {
        // this.player.x += this.playerSpeed * Math.cos(this.player.rotation + Math.PI / 2);
        // this.player.y += this.playerSpeed * Math.sin(this.player.rotation + Math.PI / 2);
        // strafe player right
        // this.player.x += this.playerSpeed * Math.cos(this.player.rotation + Math.PI / 2);
        // this.player.y += this.playerSpeed * Math.sin(this.player.rotation + Math.PI / 2);
    }


}