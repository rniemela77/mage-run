// enemy.js
class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.crosshair = scene.crosshair;
        this.player = scene.player;
        this.time = scene.time;
        this.player = scene.player;
        

        this.enemies = this.physics.add.group();

        // periodically add enemies
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                console.log('creating enemy');
                if (this.enemies.getChildren().length < 5)
                this.createEnemy();
            },
            loop: true,
        });

        // every 1s, all enemies shoot bullets at player
        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.enemies.getChildren().forEach((enemy) => {
                    //  50% chance nothing happens
                    if (Math.random() < 0.8) {
                        return;
                    }

                    const bullet = scene.add.circle(0, 0, 10, 0xff0000);
                    this.physics.add.existing(bullet);
                    bullet.body.setCircle(10, -5, -5);
                    bullet.body.setAllowGravity(false);
                    bullet.setScale(0.3);
                    bullet.x = enemy.x;
                    bullet.y = enemy.y;
                    // aim at player
                    bullet.body.setVelocity(
                        50 * Math.cos(this.physics.moveToObject(bullet, this.player.sprite(), 100)),
                        50 * Math.sin(this.physics.moveToObject(bullet, this.player.sprite(), 100))
                    );2



                    // remove debug graphics
                    bullet.body.debugShowBody = false;
                    bullet.body.debugShowVelocity = false;

                    // check for collision with player
                    this.physics.add.overlap(this.player.sprite(), bullet, (player, bullet) => {
                        // restart game
                        this.scene.scene.restart();
                    });

                    // destroy bullet after 1s
                    this.time.addEvent({
                        delay: 5000,
                        callback: () => {
                            bullet.destroy();
                        },
                    });
                });
            },
            loop: true,
        });

        // return this;
    }

    sprites() {
        return this.enemies;
    }

    createEnemy() {
        console.log('creating enemy')
        // 300px behind player
        const enemyPositionX = this.player.sprite().x - 300 * Math.cos(this.player.sprite().rotation);
        const enemyPositionY = this.player.sprite().y - 300 * Math.sin(this.player.sprite().rotation);
        
        // enemy is circle
        const enemy = this.physics.add.image(enemyPositionX, enemyPositionY, '');
        enemy.setCollideWorldBounds(true);
        enemy.body.setCircle(30, -15, -15);
        enemy.setAngularDrag(4000);
        enemy.setDrag(100);
        enemy.setMaxVelocity(70);
        enemy.setScale(0.5);
        this.enemies.add(enemy);
    }

    


    chase() {
        this.enemies.getChildren().forEach((enemy) => {
            this.physics.moveToObject(enemy, this.player.sprite(), 40);
        });
    }
}

export default Enemy;