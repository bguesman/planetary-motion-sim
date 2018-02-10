// this is a simple planetary motion simulator for two planets, implemented
// with the p5.js library

var framerate = 30; // framerate of the animation
var delta_t = 1000; // time scale between frames in seconds
var size_scale = 1.0; // way to scale planet sizes

planets = []; // array storing planets

planets[0] = {
    pos: {x: 200, y: 300}, // x y position for planet 1
    vel: {x: 0.00, y: 0.00}, // x y velocity for planet 1
    mass: 100000,
    radius: Math.log(100000) * size_scale
}

planets[1] = {
    pos: {x: 500, y: 300}, // x y position for plaet 2
    vel: {x: 0.00, y: 0.00}, // x y velocity for planet 2
    mass: 100000,
    radius: Math.log(100000) * size_scale
}

// planets[2] = {
//     pos: {x: 300, y: 100}, // x y position for plaet 2
//     vel: {x: 0.0000, y: 0.004}, // x y velocity for planet 2
//     mass: 1000,
//     radius: Math.log(1000) * size_scale
// }

// planets[3] = {
//     pos: {x: 205, y: 144}, // x y position for plaet 2
//     vel: {x: 0.004, y: -0.02}, // x y velocity for planet 2
//     mass: 2000,
//     radius: Math.log(2000) * size_scale
// }

// planets[4] = {
//     pos: {x: 300, y: 133}, // x y position for plaet 2
//     vel: {x: 0.001, y: 0.001}, // x y velocity for planet 2
//     mass: 300,
//     radius: Math.log(300) * size_scale
// }

// planets[5] = {
//     pos: {x: 600, y: 305}, // x y position for plaet 2
//     vel: {x: -0.002, y: 0.001}, // x y velocity for planet 2
//     mass: 3000,
//     radius: Math.log(3000) * size_scale
// }

var g_constant = 6.674 * Math.pow(10, -11);
// var g_constant = 6.674 * Math.pow(10, -6);

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(framerate);
    background(40, 50, 65);
    fill(color(0, 90, 190));
    noStroke();
}

function draw() {
    clear();
    // redraw background
    background(40, 50, 65);
    fill(color(0, 90, 190));
    noStroke();

    // draw the planets
    for (i = 0; i < planets.length; i++) {
        ellipse(planets[i].pos.x, planets[i].pos.y, 
            planets[i].radius, planets[i].radius);
    }

    // update their positions
    update_positions();
}

// updates positions and velocities of planets
function update_positions() {
    apply_collisions(false);

    apply_velocity();

    // OLD CODE
    // calculate the gravitational force
    // d = euclidean_dist(p1_pos.x, p1_pos.y, p2_pos.x, p2_pos.y);
    // force = p2_mass * p1_mass * g_constant / d;
    // // update each planet's velocity
    // p1_vel.x += (force / p1_mass) * ((p2_pos.x - p1_pos.x) / d) * delta_t;
    // p1_vel.y += (force / p1_mass) * ((p2_pos.y - p1_pos.y) / d) * delta_t;
    // p2_vel.x += (force / p2_mass) * ((p1_pos.x - p2_pos.x) / d) * delta_t;
    // p2_vel.y += (force / p2_mass) * ((p1_pos.y - p2_pos.y) / d) * delta_t;

    // print("p1: " + p1_vel.x + ", " + p1_vel.y);

    // apply the velocity
    // p1_pos.x += p1_vel.x * delta_t;
    // p1_pos.y += p1_vel.y * delta_t;
    // p2_pos.x += p2_vel.x * delta_t;
    // p2_pos.y += p2_vel.y * delta_t;
}

// updates the velocities of each planet according to newton's law of
// universal gravitation
function apply_gravitational_force {
    var d;
    var pi;
    var pj;
    var force;
    for (i = 0; i < planets.length; i++) {
        pi = planets[i];
        for (j = 0; j < planets.length; j++) {
            if (i != j) { // neglect self-interaction
                pj = planets[j];
                // calculate the force on i due to j
                d = euclidean_dist(pi.pos.x, pi.pos.y, pj.pos.x, pj.pos.y);
                force = pj.mass * pi.mass * g_constant / d;
                pi.vel.x += (force / pi.mass) * ((pj.pos.x - pi.pos.x) / d) * delta_t;
                pi.vel.y += (force / pi.mass) * ((pj.pos.y - pi.pos.y) / d) * delta_t;
            }
        }
    }
}

// adds support for basic collisions
// i/p: p_elastic, a boolean specifying if collisions should be elastic
// or inelastic
function apply_collisions(p_elastic) {
    var d;
    var pi;
    var pj;
    var xvel;
    var yvel;
    for (i = 0; i < planets.length; i++) {
        pi = planets[i];
        for (j = i; j < planets.length; j++) {
            if (i != j) { // neglect self-interaction
                pj = planets[j];
                // calculate the force on i due to j
                d = euclidean_dist(pi.pos.x, pi.pos.y, pj.pos.x, pj.pos.y);
                if (d < 0.0000001) { // we'll say the planets collide
                    if (!p_elastic) { // calculate for inelastic collisions
                        xvel = (pj.mass * pj.vel.x) + 
                            (pi.mass + pi.vel.x) / (pj.mass + pi.mass);
                        yvel = (pj.mass * pj.vel.y) + 
                            (pi.mass + pi.vel.y) / (pj.mass + pi.mass);
                        pj.vel.x = xvel;
                        pj.vel.y = yvel;
                        pi.vel.x = xvel;
                        pi.vel.y = yvel;
                    }
                }
            }
        }
    }
}

// loops through the planets and updates their positions based on their
// velocities
function apply_velocity() {
    var pi;
    for (i = 0; i < planets.length; i++) {
        pi = planets[i];
        // apply the velocity
        pi.pos.x += pi.vel.x * delta_t;
        pi.pos.y += pi.vel.y * delta_t;
    }
}

// calculates the euclidean distance between two points in the plane
function euclidean_dist(p1_x, p1_y, p2_x, p2_y) {
    return (Math.sqrt(Math.pow(p1_x - p2_x, 2) + Math.pow(p1_y - p2_y, 2)))
}
