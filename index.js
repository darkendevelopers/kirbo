var regu = document.getElementById('regu')
var ulti = document.getElementById('ulti')
var ultix = document.getElementById('ultix')
var local = document.getElementById('checkbox')
var gamemode = document.getElementById('gamemode')
var game = 0
var modes = [`Regular<br><a style="color: transparent;font-size: 17px;">ㅤ</a>`, `Ultimate<br><a style="color: transparent;font-size: 17px;">ㅤ</a>`, `Ultimate Ultimate`]
var servermode = ['regu', 'ulti', 'ultix']
window.onload = load()
function load() {
    regu.checked = true
    ulti.checked = false
    ultix.checked = false
    document.getElementById('local').checked = false
}
function locals() {
    if(local.hasAttribute("checked")) {
        local.removeAttribute("checked")
        document.getElementById('local').checked = false
    } else {
        local.setAttribute('checked','')
        document.getElementById('local').checked = true
    }
}
function mode(ids) {
    var id = document.getElementById(ids)
    regu.checked = false
    ulti.checked = false
    ultix.checked = false
    id.checked = true
}
function left() {
    if(game >= 0) game--
    if(game <= -1) game = 2;
    gamemode.innerHTML = modes[game]
    mode(servermode[game])
}
function right() {
    if(game >= 2) game = -1;
    if(game <= 1) game++
    gamemode.innerHTML = modes[game]
    mode(servermode[game])
}
function join() {
    var code = prompt('Code:')
    location.href = "/" + code.toLowerCase()
}
function create() {
    document.getElementById("index").className = "hide"
    setTimeout(() => {
        document.getElementById("menu").className = "show"
    }, 0);
    setTimeout(() => {
        document.getElementById("index").className = "menu"
        load()
    }, 500);
}
particlesJS("particles-js", {
    "particles": {
    "number": {
        "value": 80,
        "density": {
        "enable": true,
        "value_area": 700 } },
    "color": {
        "value": "#ffffff" },

    "shape": {
        "type": "circle",
        "stroke": {
        "width": 0,
        "color": "#000000" },

        "polygon": {
        "nb_sides": 5 } },


    "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
        "enable": false,
        "speed": 0.1,
        "opacity_min": 0.1,
        "sync": false } },


    "size": {
        "value": 3,
        "random": true,
        "anim": {
        "enable": false,
        "speed": 10,
        "size_min": 0.1,
        "sync": false } },


    "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1 },

    "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200 } } },



    "interactivity": {
    "detect_on": "canvas",
    "events": {
        "onhover": {
        "enable": true,
        "mode": "grab" },

        "onclick": {
        "enable": true,
        "mode": "push" },

        "resize": true },

    "modes": {
        "grab": {
        "distance": 140,
        "line_linked": {
            "opacity": 1 } },


        "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3 },

        "repulse": {
        "distance": 200,
        "duration": 0.4 },

        "push": {
        "particles_nb": 4 },

        "remove": {
        "particles_nb": 2 } } },

        

    "retina_detect": true });
