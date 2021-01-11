import * as RND from './util/random';
import vec2 from 'gl-vec2';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

var width = canvas.width = 400;
var height = canvas.height = 400;

var incriment = 0.04;
var scale = 10;
var columns, rows;
var noiseZ = 0;

columns = Math.floor(width / scale);
rows = Math.floor(height / scale);

function setup() {
    requestAnimationFrame(setup);
    clear();
    drawGrid();
}

function clear() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
}

function drawGrid() {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < columns; x++) {
            let angle = RND.noise3D(xoff, yoff, noiseZ) * Math.PI * 2;
            let v = vec2.create();
            vec2.add(v, v, [Math.sin(angle), Math.cos(angle)]);

            xoff += incriment;

            context.save();
            context.translate(x * scale, y * scale);
            context.rotate(Math.atan2(v[1], v[0]));
            context.beginPath();
            context.lineTo(0, 0);
            context.lineTo(scale, 0);
            context.lineWidth = 0.5;
            context.strokeStyle = 'white';
            context.stroke();
            context.restore();
        }
        yoff += incriment;
        noiseZ += 0.0002;
    }
}
setup();
