
import Enemy from './scripts/enemies.js';
import Player from './scripts/player.js';
import Crosshair from './scripts/crosshair.js';
import Map from './scripts/map.js';
import Ui from './scripts/ui.js';
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

        this.settings = {
            // isShooting: true,
            // isShootingForward: true,
            isLazering: false,
            isLayingMines: false,
            leaveTrail: false,
            isShootingNForward: true,
            isLockingOn: false,
        }

        this.player = new Player(this);
        this.enemies = new Enemy(this);
        this.crosshair = new Crosshair(this);
        this.map = new Map(this);
        this.ui = new Ui(this);

        this.cameras.main.startFollow(this.player.sprite());
        this.cameras.main.setZoom(3);


        // player bullet collision
        this.physics.add.overlap(this.enemies.sprites(), this.player.playerBullets, (enemy, bullet) => {
            // create a white block and put it over the enemy to give it a white flash
            const whiteBlock = this.add.rectangle(enemy.x, enemy.y, 20, 20, 0xffffff, 1);
            // shrink the white block
            this.tweens.add({
                targets: whiteBlock,
                scaleX: 0,
                scaleY: 0,
                duration: 100,
            });

            enemy.setBlendMode(Phaser.BlendModes.ADD);
            this.time.addEvent({
                delay: 200,
                callback: () => {
                    whiteBlock.destroy();
                },
            });

            enemy.life -= 1;
            if (enemy.life <= 0) {
                enemy.destroy();
            }
            bullet.destroy();
        });

        // LINE OF CIRCLES
        // this.time.addEvent({
        //     delay: 500,
        //     callback: () => {
        //         let x = 0;
        //         let y = 0;
        //         if (Math.random() < 0.5) {
        //             x = Math.random() * this.width;
        //             y = 0;
        //         } else {
        //             x = 0;
        //             y = Math.random() * this.height;
        //         }
                
        //         const playerX = this.player.sprite().x;
        //         const playerY = this.player.sprite().y;

        //         // every 0.1s, create a circle and move it toward the player
        //         this.time.addEvent({
        //             delay: 100,
        //             callback: () => {
        //                 let circle = this.add.circle(x, y, 20, 0xff0000);

        //                 this.physics.add.existing(circle);
        //                 circle.body.setCircle(20, 0, 0);
        //                 this.physics.moveTo(circle, playerX, playerY, 100);

        //                 // after 5s, destroy the circle
        //                 this.time.addEvent({
        //                     delay: 5000,
        //                     callback: () => {
        //                         circle.destroy();
        //                     },
        //                 });
        //             },
        //             repeat: 10,
        //         });
        //     },
        //     loop: true,
        // });

        // create a white square the size of a tile
        // const whiteTile = this.add.rectangle(this.map.tileWidth / 2, this.map.tileHeight / 2, this.map.tileWidth, this.map.tileHeight, 0xffffff);
        // this.physics.add.existing(whiteTile);
        // whiteTile.body.setAllowGravity(false);
        // whiteTile.body.setImmovable(true);
        // whiteTile.body.debugShowBody = false;
    }



    update() {
        // rotate cameras
        const cameraRotation = this.player.sprite().rotation + Math.PI / 2;
        this.cameras.main.setRotation(-cameraRotation);
        this.map.minimap.setRotation(-cameraRotation);

        this.player.movement();
        this.player.update();

        this.enemies.chase();

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
            // debug: true,
        },
    },
    scene: Demo,
    backgroundColor: 0x000000,
};

var game = new Phaser.Game(config);
