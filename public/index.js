let backgroundCanvas;
let timeout = false;
let bouncingBalls = [];
let c

const init = () => {
    backgroundCanvas = document.getElementById('background');
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    count = 0;
    c = backgroundCanvas.getContext('2d');
    bouncingBalls.push(new Ball(c));
    animate();
}

window.addEventListener("resize", function() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    })

const randomCoordinates = () => {
    const x = Math.floor(Math.random() * backgroundCanvas.width);
    const y = Math.floor(Math.random() * backgroundCanvas.height);
    return {x, y};
}

class Ball {
    constructor () {
        this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
        this.position = randomCoordinates(c);
        this.destination = randomCoordinates(c);
        this.size = 0;
        this.dying = false;
        this.speed = Math.ceil(Math.random() * 10)
    }
    draw(){
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.size, 0, 2* Math.PI);
        c.fill();
    }
    spawn(){
        this.size++;
        this.draw();
    }
    despawn(){
        this.size--;
        this.draw();
    }
    move(){
        if (this.position.x - this.destination.x < this.speed && this.position.y - this.destination.y < this.speed) {
            this.destination = randomCoordinates();
        }

        const xDistance = this.destination.x - this.position.x;
        const yDistance = this.destination.y - this.position.y;
        const angle = Math.atan2(yDistance, xDistance);
        this.position.x += Math.cos(angle) * this.speed;
        this.position.y += Math.sin(angle) * this.speed;

        this.draw();
    }
}

const animate = () => {
    requestAnimationFrame(animate);
    if (!timeout) {
        timeout = setTimeout(() => {
            bouncingBalls.push(new Ball);
            timeout = false;
        }, 1000);
    }
    c.fillStyle = '#fbf9bc';
    c.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    bouncingBalls.forEach((ball) => {
        if (ball.dying) {
            ball.despawn();
        }
        else if (ball.size < 10) {
            ball.spawn();
        }
        else {
            ball.move();
        }
    });
    for (let i = 0; i < bouncingBalls.length; i++) {
        let iBall = bouncingBalls[i];
        for (let j = i + 1; j < bouncingBalls.length; j++) {
            let jBall = bouncingBalls[j];
            const xDistance = iBall.position.x - jBall.position.x;
            const yDistance = iBall.position.y - jBall.position.y;
            if (Math.sqrt(xDistance ** 2 + yDistance ** 2) <= iBall.size + jBall.size) {
                bouncingBalls[i].dying = true;
                bouncingBalls[j].dying = true;
            }
        }
    }
    if (bouncingBalls.length >= 20) {
        bouncingBalls[0].dying = true;
        if (bouncingBalls[0].size <= 0) {
            bouncingBalls.splice(0, 1);
        }
    }
    bouncingBalls = bouncingBalls.filter((ball) => !(ball.dying && ball.size <= 0));
}