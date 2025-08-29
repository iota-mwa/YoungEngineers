const WIDTH = 1024;
const HEIGHT = 768;

class Game extends Phaser.Scene {
    constructor() {
        super('Game');

        this.ball = null;
        this.leftPaddle = null;
        this.rightPaddle = null;

        this.wasd = null;
        this.cursors = null;

        this.ballInMotion = false;

        // Scores
        this.jiaDeScore = 0;
        this.opponentScore = 0;
        this.jiaDeScoreText = null;
        this.opponentScoreText = null;

        // Game over flag
        this.gameOver = false;
        this.gameOverText = null;

        //Game instructions
        this.jiaDeText = 0;
        this.opponentText = 0;
        this.startText = 0;
    }

    preload() {
        this.load.image('background', 'public/assets/background.png');
        this.load.image('ball', 'public/assets/ball.png');
        this.load.image('paddle', 'public/assets/paddle.png');
    }

    create() {
        this.add.image(WIDTH / 2, HEIGHT / 2, 'background').setScale(0.8, 0.8);

        this.ball = this.physics.add.image(WIDTH / 2, HEIGHT / 2, 'ball')
            .setScale(0.05, 0.05)
            .refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1, 1);

        // Paddles
        this.leftPaddle = this.physics.add.image(50, 384, "paddle");
        this.leftPaddle.setImmovable(true);

        this.rightPaddle = this.physics.add.image(974, 384, "paddle");
        this.rightPaddle.setImmovable(true);

        this.physics.add.collider(this.ball, this.leftPaddle, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.rightPaddle, this.hitPaddle, null, this);

        // Controls
        this.input.keyboard.on('keydown-SPACE', this.startBall, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S
        });

        // Score display
        this.jiaDeScoreText = this.add.text(100, 50, 'Jia De: 0', { fontSize: '32px', fill: '#fff' });
        this.jiaDeText = this.add.text(20, 100, 'Use W and S Keys to move', { fontSize: '28px', fill: '#fff' });
    
        this.opponentScoreText = this.add.text(700, 50, 'Opponent: 0', { fontSize: '32px', fill: '#fff' });
        this.opponentText = this.add.text(620, 100, 'Use arrow keys to move', { fontSize: '28px', fill: '#fff' });

        this.startText = this.add.text(20, 150, 'Spacebar to start', { fontSize: '28px', fill: '#fff' });

        
        // Game over text (hidden initially)
        this.gameOverText = this.add.text(WIDTH / 2, HEIGHT / 2, '', { 
            fontSize: '48px', 
            fill: '#ff0000' 
        }).setOrigin(0.5);
    }

    update() {
        if (this.gameOver) return; // Stop all updates after game over

        // Jia De paddle movement
        if (this.wasd.up.isDown && this.leftPaddle.y > 0) {
            this.leftPaddle.y -= 5;
        } else if (this.wasd.down.isDown && this.leftPaddle.y < HEIGHT) {
            this.leftPaddle.y += 5;
        }

        // Opponent paddle movement
        if (this.cursors.up.isDown && this.rightPaddle.y > 0) {
            this.rightPaddle.y -= 5;
        } else if (this.cursors.down.isDown && this.rightPaddle.y < HEIGHT) {
            this.rightPaddle.y += 5;
        }

        // Score logic
        const margin = 30;
        if (this.ball.x < margin) { 
            this.opponentScore++;
            this.opponentScoreText.setText(`Opponent: ${this.opponentScore}`);
            this.checkGameOver();
            if (!this.gameOver) this.resetBall();
        } 
        else if (this.ball.x > WIDTH - margin) { 
            this.jiaDeScore++;
            this.jiaDeScoreText.setText(`Jia De: ${this.jiaDeScore}`);
            this.checkGameOver();
            if (!this.gameOver) this.resetBall();
        }
    }

    startBall() {
        if (!this.ballInMotion && !this.gameOver) {
            let initialVelocityX = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            let initialVelocityY = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            this.ball.setVelocity(initialVelocityX, initialVelocityY);
            this.ballInMotion = true;
        }
    }

    resetBall() {
        this.ball.setPosition(WIDTH / 2, HEIGHT / 2);
        this.ball.setVelocity(0, 0);
        this.ballInMotion = false;
        this.startBall();
    }

    hitPaddle(ball, paddle) {
        let velocityFactor = 1.3;
        let newVelocityX = ball.body.velocity.x * velocityFactor;
        let newVelocityY = ball.body.velocity.y * velocityFactor;

        let angleDeviationInDeg = Phaser.Math.Between(-30, 30);
        let angleDeviationInRad = Phaser.Math.DegToRad(angleDeviationInDeg);
        let newVelocity = new Phaser.Math.Vector2(newVelocityX, newVelocityY).rotate(angleDeviationInRad);
        ball.setVelocity(newVelocity.x, newVelocity.y);
    }
    
    checkGameOver() {
        if (this.jiaDeScore >= 10) {
            this.gameOver = true;
            this.ball.setVelocity(0, 0);
            this.gameOverText.setText('🎉 JIA DE wins the game!');
        } else if (this.opponentScore >= 10) {
            this.gameOver = true;
            this.ball.setVelocity(0, 0);
            this.gameOverText.setText('🏆 Opponent wins the game!');
        }
    }

}










