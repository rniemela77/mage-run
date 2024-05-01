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
                    ); 2



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

        const enemyPositionX = this.player.sprite().x - 200 * Math.cos(this.player.sprite().rotation);
        const enemyPositionY = this.player.sprite().y - 200 * Math.sin(this.player.sprite().rotation);

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
                enemy.rotation = this.physics.moveToObject(enemy, this.player.sprite(), 100) + 70;
            }
        });

        // when enemy is destroyed
        enemy.on('destroy', () => {
            // leave behind an exp
            this.createExp(enemy);
        });
    };

    createExp(enemy) {
        const exp = this.scene.add.rectangle(enemy.x, enemy.y, 20, 20, 0x5599ff);
        this.physics.add.existing(exp);
        exp.body.setCircle(50, -40, -40);
        exp.body.setAllowGravity(false);
        exp.body.setImmovable(true);
        exp.body.debugShowBody = true;


        // on scene update
        this.scene.events.on('update', () => {
            // rotate square
            exp.rotation += 0.1;

            // check for collision with player
            this.physics.add.overlap(this.player.sprite(), exp, (player, exp) => {
                console.log('picked up exp')
                
                // make it move toward the player
                this.physics.moveTo(exp, player.x, player.y, 100);
                // tween it down to 0 scale
                this.scene.tweens.add({
                    targets: exp,
                    scale: 0,
                    duration: 500,
                    onComplete: () => {
                        // destroy exp
                        exp.destroy();
                    },
                });

                this.time.addEvent({
                    delay: 500,
                    callback: () => {
                        exp.destroy();
                    },
                });
            });
        })
    }


    chase() {
        this.enemies.getChildren().forEach((enemy) => {
            this.physics.moveToObject(enemy, this.player.sprite(), 40);
        });
    }

    giveHealthBar(enemy) {
        const healthBarSize = 10;
        const healthBar = this.scene.add.rectangle(enemy.x, enemy.y, healthBarSize, 1, 0x00ff00);
        const healthBarBack = this.scene.add.rectangle(enemy.x, enemy.y, healthBarSize, 1, 0x770000);
        const distanceFromUnit = 15;

        this.scene.events.on('update', () => {
            // scale health bar
            healthBar.width = healthBarSize * enemy.life;
            healthBarBack.width = healthBarSize * enemy.totalLife;

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