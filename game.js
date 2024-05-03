
import Enemy from './scripts/enemies.js';
import Player from './scripts/player.js';
import Crosshair from './scripts/crosshair.js';
import Map from './scripts/map.js';
import Ui from './scripts/ui.js';
import Effects from './scripts/effects.js';
import Movement from './scripts/movement.js';
import Attacks from './scripts/attacks.js';

class Demo extends Phaser.Scene {
    preload() {
        this.load.image('player', 'assets/triangle.png');
    }

    /*

                MODIFIERY - JOWERS

    */

    create() {
        this.height = height;
        this.width = width;

        this.settings = {
            // isShooting: true,
            // isShootingForward: true,
            isLazering: false,
            isLayingMines: false,
            leaveTrail: false,
            isShootingNForward: true,
            isLockingOn: false,
        }

        this.attacks = new Attacks(this);
        this.player = new Player(this);
        this.enemies = new Enemy(this);
        this.crosshair = new Crosshair(this);
        this.map = new Map(this);
        this.ui = new Ui(this);
        this.movement = new Movement(this);
        this.effects = new Effects(this);
        this.effects.leaveTrail();

        this.attacks.isShootingNForward(2);
        // this.attacks.autoAOEShooting();
        // this.attacks.isLazering();

        this.cameras.main.startFollow(this.player.sprite());
        this.cameras.main.setZoom(3);

        
        // this.effects = new Effects(this);
        // this.effects.tiltShift();


        
    }



    update() {
        // rotate cameras
        const cameraRotation = this.player.sprite().rotation + Math.PI / 2;
        this.cameras.main.setRotation(-cameraRotation);
        this.map.minimap.setRotation(-cameraRotation);

        // this.player.movement();
        // this.player.update();

        // this.crosshair.update();

        // check if any enemy is within the crosshair
        // this.enemies.sprites().getChildren().forEach((enemy) => {
        //     if (this.physics.overlap(this.crosshair.sprite(), enemy)) {
        //         enemy.setTint(0xff0000);
        //     } else {
        //         enemy.clearTint();
        //     }
        // });



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
    backgroundColor: 0x000000,
};

var game = new Phaser.Game(config);
