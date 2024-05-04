
class Collision {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        this.enemies = scene.enemies;
        this.crosshair = scene.crosshair;
        this.player = scene.player;
        this.map = scene.map;

        // on scene update
        // this.scene.events.on('update', () => {
            // if enemy bullet overlaps player
            this.physics.add.overlap(this.enemies.enemyBullets, this.player.sprite(), (bullet, player) => {
                console.log('wow!');
                bullet.body.destroy();
                console.log('wow 2!');
                // this.player.exp -= 1;
            });
        // });
    }

    blackTiles() {
        // for every black tile
        this.map.grid.getChildren().forEach((tile) => {
            if (tile.fillColor === 0x000000) {
                this.map.obstacles.add(tile);

                // collide with player
                tile.body.immovable = true;

                this.physics.add.collider(this.player.sprite(), tile);
                this.physics.add.collider(this.enemies.sprites(), tile);
                this.physics.add.collider(this.player.ball, tile);
                this.physics.add.collider(this.player.playerBullets, tile);


                // if tile overlaps player bullet
                // this.physics.add.overlap(this.player.playerBullets, tile, (bullet, tile) => {
                // bullet.destroy();

                // });
            }
        });
    }
}

export default Collision;