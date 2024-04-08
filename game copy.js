// Create a new Phaser game
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.1 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

// Load assets
function preload() {
    this.load.image('player', './assets/biske.png');
    this.load.image('triangle', './assets/triansgle.png');
}

// Create the game
function create() {
    // Create the player (a square) with low friction
    this.player = this.matter.add.sprite(400, 300, 'player');
    this.player.setFriction(0.0001);
    this.player.setScale(1);
    // make the player heavy
    this.player.setMass(100);

    // Create the triangle
    this.triangle = this.matter.add.sprite(400, 450, 'triangle');
    this.triangle.setBody({
        type: 'fromVertices',
        verts: '0 150 50 0 100 100' // Adjust these values to match the shape of your triangle
    });
    this.triangle.setScale(1.6);
    this.triangle.rotation = -2; // Adjust as needed
    this.triangle.setFriction(0.1);
    this.triangle.setStatic(true);
}

// Update the game
function update() {
    // No need to check for collision in the update function as it's handled in the 'collisionstart' event
}
