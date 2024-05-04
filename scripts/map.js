class Map {
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


        this.obstacles = this.physics.add.group();

        this.createCircles();
        this.createBorder();
        this.createPath();
        this.createGrid();
        this.miniMap();
        this.createGoal();
        this.createObstacles();

        // find where the player is and draw a line from the player to some non-black tile without breaking line of sight
            // },
            // loop: true,
        // });
    }

    createGoal() {
        const randomTile = this.getRandomPathTile();
        this.goal = this.scene.add.circle(randomTile.x + this.tileWidth / 2, randomTile.y + this.tileHeight / 2, 100, 0xffd700);
        this.physics.add.existing(this.goal);
        this.goal.body.setCircle(100, 0, 0);
        this.goal.body.immovable = true;
        this.goal.setAlpha(0.5);

        this.physics.add.overlap(this.player.sprite(), this.goal, () => {
            if (this.goal.active === false) return;
            if (this.player.exp < 5) return;
            this.player.exp -= 5;
            this.goal.destroy();
            this.createGoal();
        });
    }

    getRandomPathTile() {
        const pathTiles = this.grid.getChildren().filter((tile) => {
            return tile.fillColor !== 0x000000;
        });
        return pathTiles[Math.floor(Math.random() * pathTiles.length)];
    }

    miniMap() {
        this.minimap = this.cameras.add(0, 0, this.width, this.height);
        this.minimap.startFollow(this.player.sprite());
        this.minimap.setZoom(0.1);
        this.minimap.setAlpha(0.3);
    }

    createBorder() {
        // return;
        let width = this.width;
        let height = this.height;
        const borderSize = 1;
        const borderColor = 0xff0000;
        this.physics.world.setBounds(0, 0, width, height);
        let a = this.scene.add.rectangle(0, 0, width, borderSize, borderColor).setOrigin(0, 0);
        let b = this.scene.add.rectangle(0, 0, borderSize, height, borderColor).setOrigin(0, 0);
        let c = this.scene.add.rectangle(0, height - borderSize, width, borderSize, borderColor).setOrigin(0, 0);
        let d = this.scene.add.rectangle(width - borderSize, 0, borderSize, height, borderColor).setOrigin(0, 0);

        // add to physics and obstacles
        this.physics.add.existing(a);
        this.physics.add.existing(b);
        this.physics.add.existing(c);
        this.physics.add.existing(d);

        this.obstacles.add(a);
        this.obstacles.add(b);
        this.obstacles.add(c);
        this.obstacles.add(d);

        a.body.immovable = true;
        b.body.immovable = true;
        c.body.immovable = true;
        d.body.immovable = true;
    }

    createTrack() {
        return;
        const circle2 = this.scene.add.circle(this.width / 2, this.height / 2, 400, 0x000000);
        this.physics.add.existing(circle2);
        circle2.body.setCircle(400, 0, 0);
        circle2.body.immovable = true;
        circle2.body.debugShowBody = true;
        // collides with player
        this.physics.add.collider(this.player.sprite(), circle2);

        // slice of circle
        const slice = new Phaser.Geom.Circle(this.width / 2, this.height / 2, 400);
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircleShape(slice);
        graphics.setAlpha(0.2);



        this.physics.add.overlap(this.player.sprite(), circle2, () => {
            // this.player.sprite().x = this.width / 2;
            // this.player.sprite().y = this.height / 2;
            console.log('overlapping 2')
        });

        const circle3 = this.scene.add.circle(this.width / 2, this.height / 2, 700, 0xffffff);
        this.physics.add.existing(circle3);
        circle3.body.setCircle(700, 0, 0);
        circle3.setAlpha(0.2);
        circle3.body.immovable = true;
        circle3.body.debugShowBody = true;
    }

    createGrid() {

        // randomly generated track
        const track = [
            ["1", "1", "1", "1", "1"],
            ["1", "0", "0", "0", "1"],
            ["1", "0", "1", "1", "1"],
            ["1", "0", "1", "0", "1"],
            ["1", "1", "1", "1", "1"],
        ];

        const gridRows = track.length;
        const gridCols = track[0].length;

        this.tileWidth = this.width / gridCols;
        this.tileHeight = this.height / gridRows;

        this.grid =
            this.physics.add.staticGroup();

        for (let i = 0; i < track.length; i++) {
            for (let j = 0; j < track[i].length; j++) {
                const tile = track[i][j];

                let rect = this.scene.add.rectangle(j * this.tileWidth, i * this.tileHeight, this.tileWidth, this.tileHeight, 0x333333);

                // make collide with player
                this.physics.add.existing(rect);

                rect.setOrigin(0, 0);
                rect.depth = -1;

                if (tile === "0") {
                    rect.fillColor = 0x000000;
                    rect.depth = 10;
                }

                // if this tile has only one other black tile around it, make it red
                // if (tile === "0") {
                //     let blackTiles = 0;
                //     if (i > 0 && track[i - 1][j] === "0") {
                //         blackTiles++;
                //     }
                //     if (i < track.length - 1 && track[i + 1][j] === "0") {
                //         blackTiles++;
                //     }
                //     if (j > 0 && track[i][j - 1] === "0") {
                //         blackTiles++;
                //     }
                //     if (j < track[i].length - 1 && track[i][j + 1] === "0") {
                //         blackTiles++;
                //     }
                //     if (blackTiles === 1) {
                //         // return;
                //         rect.fillColor = 0xff0000;
                //         rect.y -= this.tileWidth / 2;
                //         const circle = this.scene.add.circle(j * this.tileWidth + this.tileWidth / 2, i * this.tileHeight + this.tileHeight / 2, this.tileWidth / 2, 0xff0000);
                //     }
                // }


                this.grid.add(rect);
            }
        }

    }

    createObstacles() {
        return;
        // place along edges of path tiles
        this.grid.getChildren().forEach((tile, i, z) => {
            if (i <= z.length - 10) {
                // if (tile.fillColor === 0x000000) {
                const randomSize = Phaser.Math.Between(40, 180);
                // const randomX = tile.x + this.tileWidth;
                // const randomY = tile.y + this.tileHeight;
                const randomX = tile.x + this.tileWidth / 2;
                const randomY = tile.y + this.tileHeight / 2;
                const circle = this.scene.add.circle(randomX, randomY, randomSize, 0x000000);
                this.obstacles.add(circle);
                this.physics.add.existing(circle);
                circle.body.setCircle(randomSize, 0, 0);
                circle.body.immovable = true;

                this.physics.add.collider(this.player.sprite(), circle);

                circle.depth = -1;
            }
        });
    }

    createCircles() {
        // for each 
        return;
        this.obstacles = this.physics.add.group();
        for (let i = 0; i < 10; i++) {
            const randomSize = Phaser.Math.Between(70, 300);
            const randomX = Phaser.Math.Between(0, this.width);
            const randomY = Phaser.Math.Between(0, this.height);
            const circle = this.scene.add.circle(randomX, randomY, randomSize, 0x111111);
            this.obstacles.add(circle);
            this.physics.add.existing(circle);
            circle.body.setCircle(randomSize, 0, 0);
            circle.body.immovable = true;
            this.physics.add.collider(this.player.sprite(), circle);

            circle.body.debugShowBody = false;
        }
    }

    createPath() {
        return;
        this.path = this.scene.add.rectangle(this.player.sprite().x, this.player.sprite().y, 200, 600, 0x0000ff);
        this.physics.add.existing(this.path);
        this.path.depth = -1;
    }

    sprite() {
        // return this.crosshair;
    }
}

export default Map;