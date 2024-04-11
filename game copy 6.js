class Demo extends Phaser.Scene {
    preload() {
    }

    create() {
        // create player
        this.player = this.add.rectangle(400, 300, 50, 50, 0x0000ff);
        this.physics.add.existing(this.player);
        this.player.body.collideWorldBounds = true;

        this.isDragging = false;
        this.playerSpeed = 300;

        // on drag start
        this.input.on('pointerdown', (pointer) => {
            this.isDragging = true;
            this.dragStart = [pointer.x, pointer.y];
        });

        // on pointer move
        this.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                const dragEnd = [pointer.x, pointer.y];
                const dragVector = new Phaser.Math.Vector2(dragEnd[0] - this.dragStart[0], dragEnd[1] - this.dragStart[1]);
                dragVector.normalize();
                this.player.body.velocity.x = dragVector.x * this.playerSpeed;
                this.player.body.velocity.y = dragVector.y * this.playerSpeed;
            }            
        });

        // on drag end
        this.input.on('pointerup', (pointer) => {
            this.isDragging = false;
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        });


        const circle = new Phaser.Geom.Circle(400, 300, 260);

        function addCircle() {

        // yellow circle
        this.add.graphics()
            .fillStyle(0xffff00)
            .fillCircle(20, 20, 20)
            .generateTexture('tinyCircle', 50, 50)
            .destroy();

        this.group = this.add.group({ key: 'tinyCircle', frameQuantity: 3 });

        Phaser.Actions.PlaceOnCircle(this.group.getChildren(), circle);

        this.tween = this.tweens.addCounter({
            from: 200,
            to: 200,
            duration: 1000,
            delay: 0,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
        }
        // every second, add circle
        this.time.addEvent({
            delay: 1000,
            callback: addCircle,
            callbackScope: this,
            loop: true
        });
        
    }

    update() {
        // if there are any circles, rotate them
        if (this.group) {
            console.log('test');
        }
        // Phaser.Actions.RotateAroundDistance(this.group.getChildren(), { x: 400, y: 300 }, 0.02, this.tween.getValue());

        // Phaser.Actions.RotateAroundDistance(this.group.getChildren(), { x: 400, y: 300 }, 0.02, this.tween.getValue());
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