class Demo extends Phaser.Scene {
    preload() {
    }

    create() {
        // create rightSquare
        this.rightSquare = this.add.rectangle(0, 300, 50, 50, 0x0000ff);
        this.physics.add.existing(this.rightSquare);
        this.rightSquare.body.collideWorldBounds = true;
        // origin center
        this.rightSquare.setOrigin(0.5, 0.5);

        // create leftSquare
        this.leftSquare = this.add.rectangle(700, 300, 50, 50, 0xff0000);
        this.physics.add.existing(this.leftSquare);
        this.leftSquare.body.collideWorldBounds = true;

        this.resetSquares = () => {
            this.rightSquare.x = 0;
            this.leftSquare.x = 750;
        }
        this.resetSquares();


        // target position
        this.target = [10, 10];
        this.createRandomTarget = () => {
            // remove any existing target circle
            this.children.list = this.children.list.filter(child => child.fillColor !== 0xff0000);

            const randomX = () => Phaser.Math.Between(50, 750);
            const randomY = () => Phaser.Math.Between(50, 550);

            this.target = [randomX(), randomY()]

            // draw a small circle at the target position
            // this.add.circle(this.target[0], this.target[1], 5, 0xff0000);
            // this.add.circle(this.target[0], this.target[1], 5, 0xff0000);
        }
        this.createRandomTarget();



        // every 3 seconds, change the target position
        // this.time.addEvent({
        //     delay: 3000,
        //     callback: () => {
        // this.resetSquares();
        // this.createRandomTarget();
        // },
        // loop: true,
        // });

        // on click, lock the mouse
        this.isPointerLocked = false;
        this.input.on('pointerdown', () => {
            // if (!this.isPointerLocked) {
                // this.input.mouse.requestPointerLock();
            // }
            // else
                // this.input.mouse.releasePointerLock();
        });


        // on mousemove event, update the target position
        this.input.on('pointermove', (pointer) => {
            // put a square on the likely mouse position
            // this.add.rectangle(pointer.x, pointer.y, 5, 5, 0x00ff00);

            // console.log(pointer);
            // get distance of mouse pointer from target
            const distance = Phaser.Math.Distance.Between(this.target[0], this.target[1], this.input.x, this.input.y);
            const distanceX = this.target[0] - this.input.x;
            const distanceY = this.target[1] - this.input.y;

            // distance percent from mouse pointer to target. (absolute/positive)
            // const distancePct = Math.abs(distance / 800);
            const distanceXPct = Math.abs(distanceX);
            const distanceYPct = Math.abs(distanceY);

            console.log(distanceXPct, distanceYPct);

            this.rightSquare.x = 800 - distanceXPct;
            this.leftSquare.x = distanceYPct;
            
            // this.rightSquare.width = distancePct;
        });
    }

    update() {
        // get locked mouse position
        // if (this.input.mouse.locked) {
        // console.log(this.input.mouse.lock.lockedPointer.x, this.input.mouse.lock.lockedPointer.y);)



        // on click, restart scene
        // this.input.on('pointerdown', () => {
        //     this.scene.restart();
        // });


        // if right square touches right wall, reset
        if (this.rightSquare.x > 770 && this.leftSquare.x < 30) {
            this.resetSquares();
            // remove the old target circle
            this.createRandomTarget();
        }


        // track the mouse


        // if the mouse is locked, move the left square to the mouse
        // if (this.input.mouse.locked) {
        // this.leftSquare.x = this.input.x;
        // this.leftSquare.y = this.input.y;
        // }
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