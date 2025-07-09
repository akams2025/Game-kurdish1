const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: '#88ddee',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player, cursors, coins, obstacles, score = 0, scoreText;
let gameOver = false, restartButton;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('obstacle', 'assets/obstacle.png');
    this.load.image('restart', 'assets/restart.png');
}

function create() {
    this.add.image(200, 300, 'background').setScale(1);
    player = this.physics.add.sprite(200, 500, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    coins = this.physics.add.group();
    obstacles = this.physics.add.group();

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#000' });

    for (let i = 0; i < 5; i++) {
        let coin = coins.create(Phaser.Math.Between(50, 350), Phaser.Math.Between(-500, -50), 'coin');
        coin.setVelocityY(100);
        coin.setScale(0.5);
    }

    for (let i = 0; i < 3; i++) {
        let obs = obstacles.create(Phaser.Math.Between(50, 350), Phaser.Math.Between(-400, -100), 'obstacle');
        obs.setVelocityY(150);
        obs.setScale(0.6);
    }

    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
}

function update() {
    if (gameOver) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    coins.children.iterate(function (coin) {
        if (coin.y > 600) {
            coin.y = Phaser.Math.Between(-500, -50);
            coin.x = Phaser.Math.Between(50, 350);
        }
    });

    obstacles.children.iterate(function (obs) {
        if (obs.y > 600) {
            obs.y = Phaser.Math.Between(-400, -100);
            obs.x = Phaser.Math.Between(50, 350);
        }
    });
}

function collectCoin(player, coin) {
    coin.y = Phaser.Math.Between(-500, -50);
    coin.x = Phaser.Math.Between(50, 350);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function hitObstacle(player, obstacle) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    scoreText.setText('Game Over! Score: ' + score);

    restartButton = this.add.image(200, 300, 'restart').setInteractive().setScale(0.5);
    restartButton.on('pointerdown', () => {
        this.scene.restart();
        score = 0;
        gameOver = false;
    });
}
