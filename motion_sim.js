// this is a simple planetary motion simulator for two planets, implemented
// with the p5.js library

var framerate = 60; // framerate of the animation
var delta_t = 40; // time scale between frames in seconds
var size_scale = 0.8; // way to scale planet sizes

planets = []; // array storing planets

var g_constant = 6.674 * Math.pow(10, -11);
// var g_constant = 6.674 * Math.pow(10, -6);

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(framerate);
    background(40, 50, 65);
    fill(color(0, 90, 190));
    noStroke();

    // init_basic();
    // init_single_planet_system();
    // init_binary_star_system();
    //  init_random();
    init_solar_system_starter();
}

function draw() {
    clear();
    // redraw background
    background(40, 50, 65);
    noStroke();

    // draw the planets
    var pi;
    for (i = 0; i < planets.length; i++) {
        pi = planets[i];
        fill(color(pi.color.r, pi.color.g, pi.color.b));
        ellipse(pi.pos.x, pi.pos.y, 2 * pi.radius, 2 * pi.radius);
    }

    // update their positions
    update_positions();
}

// updates positions and velocities of planets
function update_positions() {
    apply_gravitational_force();
    apply_collisions(false);
    apply_velocity();
}

// updates the velocities of each planet according to newton's law of
// universal gravitation
function apply_gravitational_force() {
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
                if (d != 0) {
                    force = pj.mass * pi.mass * g_constant / d;
                    pi.vel.x += (force / pi.mass) * ((pj.pos.x - pi.pos.x) / d) * delta_t;
                    pi.vel.y += (force / pi.mass) * ((pj.pos.y - pi.pos.y) / d) * delta_t;
                }
            }
        }
    }
}

// adds support for basic collisions
// i/p: p_elastic, a boolean specifying if collisions should be elastic
// or inelastic
function apply_collisions(p_elastic) {
    var pi;
    var pj;
    if (!p_elastic) { // use inelastic collisions
        for (i = 0; i < planets.length; i++) {
            pi = planets[i];
            for (j = i; j < planets.length; j++) {
                if (i != j) { // neglect self-interaction
                    pj = planets[j];
                    if (euclidean_dist(pi.pos.x, pi.pos.y, pj.pos.x, pj.pos.y) < pi.radius + pj.radius) {
                        // we'll say the planets collide
                        // find the new velocities and the new mass
                        pi.vel.x = ((pi.vel.x * pi.mass) + (pj.vel.x * pj.mass)) / (pi.mass + pj.mass)
                        pi.vel.y = ((pi.vel.y * pi.mass) + (pj.vel.y * pj.mass)) / (pi.mass + pj.mass)
                        pi.mass += pj.mass;
                        pi.radius = Math.log(pi.mass) * size_scale;
                        // also average their colors, weighted by mass
                        pi.color = combine_colors(pi.color, pj.color, pi.mass, pj.mass);
                        // remove pj from the array
                        planets.splice(j, 1);
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

// stes up a basic demo of the gravitational force
function init_basic() {
    // first planet
    planets[planets.length] = {
        pos: {x: 400, y: 300}, // x y position for planet 1
        vel: {x: 0, y: 0}, // x y velocity for planet 1
        mass: 1000000,
        color: {r: 250, g: 0, b: 0}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;

    // second planet
    planets[planets.length] = {
        pos: {x: 800, y: 300}, // x y position for plaet 2
        vel: {x: 0, y: 0}, // x y velocity for planet 2
        mass: 1000000,
        color: {r: 0, g: 250, b: 0}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;
}

// initializes a single planet system
function init_single_planet_system() {
    // star
    planets[planets.length] = {
        pos: {x: 575, y: 300}, // x y position for plaet 2
        vel: {x: 0, y: 0}, // x y velocity for planet 2
        mass: 70000000,
        color: {r: 0, g: 250, b: 0}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;

    // planet
    planets[planets.length] = {
        pos: {x: 300, y: 300}, // x y position for planet 1
        vel: {x: 0.00, y: 0.07}, // x y velocity for planet 1
        mass: 50000,
        color: {r: 250, g: 0, b: 0}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;
}

// sets up a binary star system
function init_binary_star_system() {

    // star 1
    planets[planets.length] = {
        pos: {x: 575, y: 300},
        vel: {x: 0.00, y: 0.05},
        mass: 70000000,
        color: {r: 0, g: 250, b: 0}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;

    // second star
    planets[planets.length] = {
        pos: {x: 625, y: 300},
        vel: {x: 0.00, y: -0.05},
        mass: 70000000,
        color: {r: 150, g: 250, b: 0}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;

    // first planet
    planets[planets.length] = {
        pos: {x: 100, y: 300},
        vel: {x: 0.00, y: 0.08},
        mass: 500000,
        color: {r: 250, g: 0, b: 0}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;

    // planet 0's moon
    planets[planets.length] = {
        pos: {x: 82, y: 300},
        vel: {x: 0.0001, y: 0.085},
        mass: 100,
        color: {r: 0, g: 150, b: 250}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;

    // another planet
    planets[planets.length] = {
        pos: {x: 300, y: 300},
        vel: {x: 0.004, y: 0.06},
        mass: 2000,
        color: {r: 0, g: 250, b: 205}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;

    // another planet
    planets[planets.length] = {
        pos: {x: 300, y: 133},
        vel: {x: 0.00, y: 0.04},
        mass: 300,
        color: {r: 150, g: 3, b: 250}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;

}

// initializes a random configuration!
function init_random() {
    var numplanets = Math.random() * 100;
    for (i = 0; i < numplanets; i++) {
        planets[planets.length] = {
            pos: {x: Math.random() * 800 + 200, y: Math.random() * 800},
            vel: {x: rand() * 0.04, y: rand() * 0.04},
            mass: Math.pow(10, Math.random() * 5 + 2),
            color: {r: Math.random() * 250, g: Math.random() * 250, b: Math.random() * 250}
        }
        planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;
    }
}

// initializes a random configuration!
function init_solar_system_starter() {
    // star
    planets[planets.length] = {
        pos: {x: 600, y: 300},
        vel: {x: 0, y: 0},
        mass: Math.pow(10, 7),
        color: {r: 0, g: 250, b: 0}
    }
    planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;
    // proto-particles
    var numplanets = Math.random() * 70 + 1000;
    for (i = 0; i < numplanets; i++) {
        planets[planets.length] = {
            pos: {x: Math.random() * 800 + 200, y: Math.random() * 800},
            vel: {x: rand() * 0.05, y: rand() * 0.05},
            mass: Math.pow(10, 1),
            color: {r: Math.random() * 250, g: Math.random() * 250, b: Math.random() * 250}
        }
        planets[planets.length - 1].radius = Math.log(planets[planets.length - 1].mass) * size_scale;
    }
}

// returns a number between -1 and 1
function rand() {
    if (Math.random() > 0.5) {
        return Math.random();
    } else {
        return -Math.random();
    }
}

// combines two planet colors based on m1 and m2 (masses)
function combine_colors(c1, c2, m1, m2) {
    return {r: weighted_avg(c1.r, c2.r, m1, m2),
        g: weighted_avg(c1.g, c2.g, m1, m2),
        b: weighted_avg(c1.b, c2.b, m1, m2)};
}

// Takes weighted average of c1 and c2 with weights calculated as m1/m2 divided
// by their sum. Used for averaging out colors upon inelastic collisions.
function weighted_avg(n1, n2, m1, m2) {
    return n1 * (m1 / (m1 + m2)) + n2 * (m2 / (m1 + m2));
}
