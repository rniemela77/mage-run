// enemy.js
class Crosshair {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.crosshair = scene.crosshair;
        this.player = scene.player;
        this.time = scene.time;
        this.player = scene.player;
        this.enemies = scene.enemies;

        // create crosshair
        this.crosshair = scene.add.circle(this.player.sprite().x, this.player.sprite().y, 1, 0xffffff);
        this.physics.add.existing(this.crosshair);
        this.crosshair.body.setCircle(100, -100, -100);
        this.crosshair.body.debugShowBody = true;


        this.showLOS()
    }

    update() {
        // place crosshair on player  
        this.crosshair.x = this.player.sprite().x;
        this.crosshair.y = this.player.sprite().y;
    }

    sprite() {
        return this.crosshair;
    }

    showLOS() {
        // every 0.5s, create a line to each enemy
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.enemies.sprites().getChildren().forEach((enemy) => {
                    // check if its in hitbox
                    if (!this.physics.overlap(this.crosshair, enemy)) {
                        return;
                    }

                    const line = new Phaser.Geom.Line(this.player.sprite().x, this.player.sprite().y, enemy.x, enemy.y);
                    const graphics = this.scene.add.graphics();
                    graphics.lineStyle(1, 0xff0000, 1);
                    graphics.strokeLineShape(line);
                    this.time.addEvent({
                        delay: 100,
                        callback: () => {
                            graphics.destroy();
                        },
                    });
                });
            },
            loop: true,
        });
    }
}

export default Crosshair;