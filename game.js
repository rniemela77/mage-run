
// import Enemy from './scripts/enemy.js';




import Enemy from './scripts/enemies.js';
import Player from './scripts/player.js';
import Crosshair from './scripts/crosshair.js';
import Map from './scripts/map.js';
class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/triangle.png');
    }

    /*

                MODIFIERY

    */
    1
    create() {
        this.height = height;
        this.width = width;

        this.player = new Player(this);
        this.enemies = new Enemy(this);
        this.crosshair = new Crosshair(this);
        this.map = new Map(this);






        // Create a new camera for the UI elements
        // let UICamera = this.cameras.add(0, 0, 500, 200);

        // minimap
        // let minimap = this.cameras.add(width - 200, height - 200, 200, 200);
        // minimap.startFollow(this.player);
        // minimap.setZoom(0.2);


        // camera ignores player and follows the UI
        // UICamera.ignore(this.player);
        // UICamera.ignore(this.enemies);

        //zoom uicamera
        // UICamera.setZoom(1);

        // create a circle around the player

        // this.heat = 0;


        this.cameras.main.startFollow(this.player.sprite());
        this.cameras.main.setZoom(2);


        // player bullet collision
        this.physics.add.overlap(this.enemies.sprites(), this.player.playerBullets, (enemy, bullet) => {
            enemy.destroy();
            bullet.destroy();
        });
    }



    update() {
        // rotate cameras
        const cameraRotation = this.player.sprite().rotation + Math.PI / 2;
        this.cameras.main.setRotation(-cameraRotation);
        this.map.minimap.setRotation(-cameraRotation);

        this.player.movement();

        this.enemies.chase();

        this.crosshair.update();

        // check if any enemy is within the crosshair
        this.enemies.sprites().getChildren().forEach((enemy) => {
            if (this.physics.overlap(this.crosshair.sprite(), enemy)) {
                enemy.setTint(0xff0000);
            } else {
                enemy.clearTint();
            }
        });



        // this.heat += 0.01;
        // if an enemy is within the crosshair, add to heat
        // this.enemies.getChildren().forEach((enemy) => {
        //     if (this.physics.overlap(this.crosshair, enemy)) {
        //         this.heat += 0.05;
        //     }
        // });

        // heat text
        // let heatstring = '';
        // for (let i = 1; i < this.heat; i++) {
        // heatstring += '|';
        // }
        // this.text.setText('Heat: ' + Math.floor(this.heat) + '\n' + heatstring
        // );




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