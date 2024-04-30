class Ui {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.crosshair = scene.crosshair;
        this.player = scene.player;
        this.time = scene.time;
        this.player = scene.player;
        this.cameras = scene.cameras;
        this.enemies = scene.enemies;
        this.height = scene.height;
        this.width = scene.width;

        this.createUi();
    }

    createUi() {
        // UI BG
        this.UICamera = this.cameras.add(0, 0, 500, 200);
        this.UICamera.setScroll(0, 0);
        this.UICamera.setZoom(1);
        this.UICamera.setBackgroundColor('rgba(0, 0, 0, 1)');

        // Text
        const fontSize = 30;

        Object.keys(this.scene.settings).forEach((key, index) => {
            const btn = this.scene.add.text(10, 10 + (fontSize * index), `${key}: ${this.scene.settings[key]}`, {
                fontSize: `${fontSize}px`,
                fill: '#fff',
            });

            if (this.scene.settings[key]) {
                btn.setFill('#0f0');
            } else {
                btn.setFill('#f00');
            }

            btn.setScrollFactor(0);
            // on click
            btn.setInteractive();
            btn.on('pointerdown', () => {
                this.scene.settings[key] = !this.scene.settings[key];
                btn.setText(`${key}: ${this.scene.settings[key]}`);
                // set color of text

            if (this.scene.settings[key]) {
                btn.setFill('#0f0');
            } else {
                btn.setFill('#f00');
            }
            });

        });
    }
}

export default Ui;