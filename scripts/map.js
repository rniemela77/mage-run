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

        this.createCircles();
        this.createBorder();
        this.createPath();
        this.createGrid();

        this.miniMap();
    }

    update() {
    }

    miniMap() {
        // Create a new camera for the UI elements
        // let UICamera = this.cameras.add(0, 0, 500, 200);

        // minimap
        this.minimap = this.cameras.add(0, 0, this.width, this.height);
        this.minimap.startFollow(this.player.sprite());
        this.minimap.setZoom(0.2);
        this.minimap.setAlpha(0.2);

        // console.log(this.minimap);

        return this.minimap;
        // const cameraRotation = this.player.sprite().rotation + Math.PI / 2;
        // minimap.setRotation(-cameraRotation);

        // camera ignores player and follows the UI
        // UICamera.ignore(this.player.sprite());
        // UICamera.ignore(this.enemies.sprites());

        //zoom uicamera
        // UICamera.setZoom(1);


        // camera rotates with player 
        // this.cameras.main.startFollow(this.player.sprite());



        // create a circle around the player
        // this.heat = 0;

    }

    createBorder() {
        let width = this.width;
        let height = this.height;
        //world bounds are black
        this.physics.world.setBounds(0, 0, width, height);
        this.scene.add.rectangle(0, 0, width, 20, 0x000000).setOrigin(0, 0);
        this.scene.add.rectangle(0, 0, 20, height, 0x000000).setOrigin(0, 0);
        this.scene.add.rectangle(0, height - 20, width, 20, 0x000000).setOrigin(0, 0);
        this.scene.add.rectangle(width - 20, 0, 20, height, 0x000000).setOrigin(0, 0);
    }

    createGrid() {
        // make the background a grid
        const gridSize = 500;
        for (let i = 0; i < this.scene.width; i += gridSize) {
            this.scene.add.rectangle(i, 0, 1, this.scene.height, 0x000000).setOrigin(0, 0);
        }
        for (let i = 0; i < this.scene.height; i += gridSize) {
            this.scene.add.rectangle(0, i, this.scene.width, 1, 0x000000).setOrigin(0, 0);
        }

        // set a path of tiles to be white
        for (let i = 0; i < 10; i++) {
            // this.scene.add.rectangle(0, i * gridSize, gridSize, gridSize, 0xffffff).setOrigin(0, 0);
        }
    }

    createCircles() {
        this.obstacles = this.physics.add.group();
        for (let i = 0; i < 10; i++) {
            const randomSize = Phaser.Math.Between(70, 300);
            const randomX = Phaser.Math.Between(0, this.width);
            const randomY = Phaser.Math.Between(0, this.height);
            const circle = this.scene.add.circle(randomX, randomY, randomSize, 0x666666);
            this.obstacles.add(circle);
            this.physics.add.existing(circle);
            circle.body.setCircle(randomSize, 0, 0);
            circle.body.immovable = true;
            this.physics.add.collider(this.player.sprite(), circle);

            circle.body.debugShowBody = false;
        }
    }

    createPath() {
        this.path = this.scene.add.rectangle(this.player.sprite().x, this.player.sprite().y, 200, 600, 0x0000ff);
        this.physics.add.existing(this.path);
        this.path.depth = -1;
    }

    sprite() {
        // return this.crosshair;
    }
}

export default Map;