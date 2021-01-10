import * as RND from './util/random';
import vec2 from 'gl-vec2';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var width = canvas.width = 400;
var height = canvas.height = 400;

var incriment = 0.01;
var scale = 10;
var columns, rows;
var noiseZ = 0;

columns = Math.floor(width / scale);
rows = Math.floor(height / scale);

var flowfield = new Array(columns * rows);

var particles = [];
for (var i = 0; i < 300; i++) {
    particles[i] = new Particle();
}

function setup() {
    requestAnimationFrame(setup);
    clear();
    drawGrid();
}

function clear() {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
}

function drawGrid() {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < columns; x++) {
            let index = x + y * columns;
            let angle = RND.noise3D(xoff, yoff, noiseZ) * Math.PI * 2;
            let v = vec2.create();
            vec2.add(v, v, [Math.sin(angle), Math.cos(angle)]);

            flowfield[index] = v;
            xoff += incriment;

            context.save();
            context.translate(x * scale, y * scale);
            context.rotate(Math.atan2(v[1], v[0]));
            context.beginPath();
            context.lineTo(0, 0);
            context.lineTo(scale, 0);
            context.lineWidth = 2;
            context.stroke();
            context.restore();
        }
        yoff += incriment;
        noiseZ += 0.0003;
    }

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let x = Math.floor(p.pos[0] / scale);
        let y = Math.floor(p.pos[1] / scale);
        let index = x + y * columns;
        let force = flowfield[index];

        // play with vector
        vec2.add(p.acc, p.acc, force);

        vec2.add(p.vel, p.vel, p.acc);
        vec2.limit(p.vel, p.vel, p.maxSpeed);
        vec2.add(p.pos, p.pos, p.vel);
        vec2.normalize(p.acc, p.acc);
        // vec2.mul(p.acc, p.acc, [0, 0]);

        context.fillStyle = 'red';
        context.fillRect(p.pos[0], p.pos[1], p.size, p.size);

        if (p.pos[0] > width) {
            p.pos[0] = 0;
            p.prevPos[0] = p.pos[0];
        } else if (p.pos[0] < 0) {
            p.pos[0] = width - p.size;
            p.prevPos[0] = p.pos[0];
        }
        if (p.pos[1] > height) {
            p.pos[1] = 0;
            p.prevPos[1] = p.pos[1];
        } else if (p.pos[1] < 0) {
            p.pos[1] = height - p.size;
            p.prevPos[1] = p.pos[1];
        }
    }
}

function Particle() {
    this.pos = vec2.fromValues(Math.random() * width, Math.random() * height);
    this.vel = vec2.create();
    this.acc = vec2.create();
    this.size = 8;
    this.maxSpeed = 4;
    this.prevPos = vec2.copy([], this.pos);
}

setup();
