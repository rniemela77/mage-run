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
            delay: 200,
            callback: () => {
                if (this.enemies.getChildren().length < 5) {
                    this.createEnemy();
                    console.log('creating enemy');
                }
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
                    );

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
        const enemyHealth = Math.floor(Math.random() * 3) + 1;
        const enemySize = 10 * enemyHealth;

        // enemy is 200 units away from player
        const distanceFromPlayer = Math.random() > 0.5 ? 200 : -200;

        let rotationFromPlayerX = Math.sin(this.player.sprite().rotation);
        let rotationFromPlayerY = Math.cos(this.player.sprite().rotation);
        if (Math.random() > 0.5) {
            rotationFromPlayerX = Math.cos(this.player.sprite().rotation);
            rotationFromPlayerY = Math.sin(this.player.sprite().rotation);
        }
        const enemyPositionX = this.player.sprite().x + distanceFromPlayer * rotationFromPlayerX;
        const enemyPositionY = this.player.sprite().y + distanceFromPlayer * rotationFromPlayerY;

        // enemy is rectangle
        const enemy = this.scene.add.rectangle(enemyPositionX, enemyPositionY, enemySize, enemySize, 0x00ff00);
        this.physics.add.existing(enemy);
        enemy.body.setAllowGravity(false);
        enemy.body.setImmovable(true);
        enemy.setScale(0.8);
        enemy.life = enemyHealth;
        enemy.totalLife = enemyHealth;

        this.giveHealthBar(enemy)

        this.enemies.add(enemy);

        // make enemy face player
        this.scene.events.on('update', () => {
            if (enemy.life > 0) {
                // face AND move toward player
                // enemy.rotation = this.physics.moveToObject(enemy, this.player.sprite(), 100) + 70;
            }
        });

        // when enemy is destroyed
        enemy.on('destroy', () => {
            // leave behind an exp
            this.createExp(enemy);
        });
    };

    createExp(enemy) {
        const exp = this.scene.add.rectangle(enemy.x, enemy.y, 5, 5, 0xffffff, 0.1);
        this.physics.add.existing(exp);
        exp.body.setCircle(50, -40, -40);
        // make fill invisible
        // add yellow gold border
        exp.setStrokeStyle(5, 0xffd700);
        exp.body.setAllowGravity(false);
        exp.body.setImmovable(true);
        exp.body.debugShowBody = true;

        exp.collected = false;

        // when player touches uncollected exp
        this.physics.add.overlap(this.player.sprite(), exp, (player, exp) => {
            if (!exp.collected) {
                exp.collected = true;
            }
        });

        // on scene update, move all collected exp toward player
        this.scene.events.on('update', () => {
            exp.rotation += 0.1;

            // move toward player
            if (exp.collected) {


                if (exp.scale > 0.1) {
                    this.physics.moveTo(exp, this.player.sprite().x, this.player.sprite().y, 300);
                    exp.scale -= 0.01;
                } else {
                    exp.destroy();
                }

            }
        });
    }


    chase() {
        this.enemies.getChildren().forEach((enemy) => {
            let enemySpeed = 50;
            if (enemy.totalLife === 3) {
                let targetPositionX = this.player.sprite().x;
                let targetPositionY = this.player.sprite().y;

                if (Math.random() < 0.05) {
                    // if player is moving, aim where the player will be
                    const amount = 3000;
                    targetPositionX += amount * Math.cos(this.player.sprite().rotation);
                    targetPositionY += amount * Math.sin(this.player.sprite().rotation);

                    enemySpeed = 25;
                    this.physics.moveToObject(enemy, this.player.sprite(), enemySpeed);
                } else {
                    // enemySpeed = 0;
                    // this.physics.moveToObject(enemy, this.player.sprite(), 0);
                }
                // this.physics.moveToObject(enemy, this.player.sprite(), 100) + 70;
                

                return;
            }
            if (enemy.totalLife === 2) {
                // enemySpeed = 75;
                // this.physics.moveToObject(enemy, this.player.sprite(), enemySpeed);
                return;
            }
            if (enemy.totalLife === 1) {
                // enemySpeed = 100;
                // this.physics.moveToObject(enemy, this.player.sprite(), enemySpeed);
                return;
            }
        });
    }

    giveHealthBar(enemy) {
        const healthBarSize = 10 * enemy.life;
        const healthBar = this.scene.add.rectangle(enemy.x, enemy.y, healthBarSize, 1, 0x00ff00);
        const healthBarBack = this.scene.add.rectangle(enemy.x, enemy.y, healthBarSize, 1, 0x770000);
        const distanceFromUnit = 17;

        this.scene.events.on('update', () => {
            // scale health bar
            healthBar.scaleX = enemy.life / enemy.totalLife;


            // make healthbar above enemy relative to player
            const healthBarPositionX = enemy.x + distanceFromUnit * Math.cos(this.player.sprite().rotation);
            const healthBarPositionY = enemy.y + distanceFromUnit * Math.sin(this.player.sprite().rotation);

            healthBar.x = healthBarPositionX;
            healthBar.y = healthBarPositionY;
            healthBarBack.x = healthBarPositionX;
            healthBarBack.y = healthBarPositionY;


            // rotate
            healthBar.rotation = this.player.sprite().rotation + Math.PI / 2;
            healthBarBack.rotation = this.player.sprite().rotation + Math.PI / 2;


            healthBarBack.depth = -1;
        });

        // if enemy is destroyed, destroy life bar too
        enemy.on('destroy', () => {
            healthBar.destroy();
            healthBarBack.destroy();
        });
    }
}

export default Enemy;