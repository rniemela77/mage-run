class Effects {
    constructor(scene) {
        this.scene = scene;
        this.time = scene.time;
        this.player = scene.player;
    }

    tiltShift() {
        const camera = this.scene.cameras.main;
        camera.postFX.addTiltShift(0.2, 0, 5);
    }

    blackTrail() {
        const player = this.scene.player.sprite();

        // put black trail under player
        const trail = this.scene.add.circle(player.x, player.y, 2, 0x000000);
        trail.setDepth(-1);
        this.time.addEvent({
            delay: 50,
            callback: (i) => {
                trail.setScale(trail.scaleX - 0.1);
                trail.setAlpha(trail.alpha - 0.1);
            },
            repeat: 10,
        });

        // remove trail
        this.time.addEvent({
            delay: 500,
            callback: () => {
                trail.destroy();
            },
        });
    }

    leaveTrail() {
        this.time.addEvent({
            delay: 50,
            callback: () => {
                // leave a temporary blue trail that shrinks over time
                const trail = this.scene.add.circle(this.player.sprite().x, this.player.sprite().y, 5, 0x0000ff);

                trail.setDepth(-1);

                this.time.addEvent({
                    delay: 50,
                    callback: (i) => {
                        trail.setScale(trail.scaleX - 0.1);
                        trail.setAlpha(trail.alpha - 0.15);
                    },
                    repeat: 10,
                });

                this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        trail.destroy();
                    },
                });
            },
            loop: true,
        });

    }
}

export default Effects;