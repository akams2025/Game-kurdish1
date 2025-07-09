
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: '#88ddee',
    scene: {
        create: function() {
            this.add.text(100, 300, 'Rwandz Runner', { font: '24px Arial', fill: '#000' });
        }
    }
};

const game = new Phaser.Game(config);
