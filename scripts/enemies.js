// enemy.js
class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.crosshair = scene.crosshair;
        this.player = scene.player;
        this.time = scene.time;
        this.attacks = scene.attacks;
        this.player = scene.player;


        this.enemies = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.collision();
        this.chase();

        // periodically add enemies
        this.time.addEvent({
            delay: 200,
            callback: () => {
                if (this.enemies.getChildren().length < 10) {
                    this.createEnemy();
                    console.log('creating enemy');
                }
            },
            loop: true,
        });

        

        // return this;
    }

    collision() {
        // player bullet collision
        this.physics.add.overlap(this.enemies, this.player.playerBullets, (enemy, bullet) => {
            // create a white block and put it over the enemy to give it a white flash
            const whiteBlock = this.scene.add.rectangle(enemy.x, enemy.y, enemy.width * 1.3, enemy.width * 1.3, 0xffffff, 1);

            // shrink the white block
            this.scene.tweens.add({
                targets: whiteBlock,
                scaleX: 0,
                scaleY: 0,
                duration: 100,
            });

            this.time.addEvent({
                delay: 100,
                callback: () => {
                    whiteBlock.destroy();
                },
            });

            // deal damage
            enemy.life -= 1;
            if (enemy.life <= 0) {
                enemy.destroy();
            }
            bullet.destroy();
        });
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
        enemy.setScale(0.8);
        enemy.life = enemyHealth;
        enemy.totalLife = enemyHealth;

        this.giveHealthBar(enemy)

        this.enemies.add(enemy);

        // if enemy life 3
        if (enemy.totalLife === 3) {
            // give enemy blue fill
            enemy.setFillStyle(0x3983ff);

            // give enemy red outline
            enemy.setStrokeStyle(0.5, 0xff0000);

            // every 1s, lurch
            this.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.lurchToPlayer(enemy);
                },
                loop: true,
            });
        }

        // if enemy life 2
        if (enemy.totalLife === 2) {
            // give enemy orange fill
            enemy.setFillStyle(0xffa500);

            // every 2 seconds, chase player
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.chasePlayer(enemy);
                },
                loop: true,
            });
        }

        // if enemy life 1
        if (enemy.totalLife === 1) {
            // give enemy red fill
            enemy.setFillStyle(0xff0000);

            // on scene update
            this.scene.events.on('update', () => {
                this.chasePlayer(enemy);
            });
        }

        // on scene update, move enemy toward player
        this.scene.events.on('update', () => {
            // if enemy is destroyed, return
            if (enemy.life <= 0) {
                return;
            }

            if (enemy.totalLife === 3) {
                // change enemy color to blue
                enemy.setFillStyle(0x3983ff);

            } else if (enemy.totalLife === 2) {
                // this.chasePlayer(enemy);
            } else if (enemy.totalLife === 1) {
                // this.chasePlayer(enemy);
            }
        });

        // enemy collides with other enemies
        this.physics.add.collider(this.enemies, this.enemies);

        // make shoot player
        this.attacks.shootAtPlayer(enemy);

        // when enemy is destroyed
        enemy.on('destroy', () => {
            // leave behind an exp
            this.createExp(enemy);
        });
    };

    createExp(enemy) {
        const exp = this.scene.add.rectangle(enemy.x, enemy.y, 5, 5, 0xffffff, 0.1);

        this.physics.add.existing(exp);
        exp.body.setCircle(100, -100, -100);
        exp.setStrokeStyle(1, 0xffd700);
        exp.body.setAllowGravity(false);
        exp.body.setImmovable(true);
        exp.body.debugShowBody = true;

        exp.collected = false;

        // when player touches uncollected exp
        this.physics.add.overlap(this.player.sprite(), exp, (player, exp) => {
            if (!exp.collected) {
                exp.collected = true;
                this.player.exp += 1;
            }
        });

        // on scene update, move all collected exp toward player
        this.scene.events.on('update', () => {
            exp.rotation += 0.1;

            // move toward player
            if (exp.collected) {
                if (exp.scale > 0.3) {
                    this.physics.moveTo(exp, this.player.sprite().x, this.player.sprite().y, 300);
                    exp.scale -= 0.01;
                } else {
                    exp.destroy();
                }

            }
        });
    }

    chasePlayer(enemy) {
        if (enemy.life <= 0) {
            return;
        }
        enemy.rotation = this.physics.moveToObject(enemy, this.player.sprite(), 100) + 70;
    }

    lurchToPlayer(enemy) {
        if (enemy.life <= 0) {
            return;
        }

        // find angle between enemy and player
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.sprite().x, this.player.sprite().y);

        const speed = 100;

        // find point on angle that is 100px away from enemy toward player
        const targetPositionX = enemy.x + speed * Math.cos(angle);
        const targetPositionY = enemy.y + speed * Math.sin(angle);



        // move enemy to that point
        this.physics.moveTo(enemy, targetPositionX, targetPositionY, speed);


        // if player is moving, aim where the player will be
        // const amount = 3000;
        // targetPositionX += amount * Math.cos(this.player.sprite().rotation);
        // targetPositionY += amount * Math.sin(this.player.sprite().rotation);

        // const enemySpeed = 50;

        // this.physics.moveToObject(enemy, this.player.sprite(), enemySpeed);
    }

    chase() {
        return;
        this.enemies.getChildren().forEach((enemy) => {
            // give enemy red outline
            enemy.setStrokeStyle(0.5, 0xff0000);

            if (enemy.totalLife === 3) {
                // change enemy color to blue
                enemy.setFillStyle(0x3983ff);
                this.lurchToPlayer(enemy);

                return;
            }
            if (enemy.totalLife === 2) {
                // enemySpeed = 75;
                this.chasePlayer(enemy);

                return;
            }
            if (enemy.totalLife === 1) {
                this.chasePlayer(enemy);
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