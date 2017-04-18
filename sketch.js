var videoWidth = 400;
var videoHeight = 300;
var video;
var capturedImage;
var movingImage = false;
var status = "";
var easterEgg;
var currTimeout;

function preload() {
    easterEgg = loadImage("./mask.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO);
    video.size(videoWidth, videoHeight);
    video.hide();
    easterEgg.position = {};
    easterEgg.position.x = floor(random(0,windowWidth));
    easterEgg.position.y = floor(random(0,windowHeight));
}

function draw() {
    background(51);
    if (easterEgg.destination) {
        if (easterEgg.position.x < easterEgg.destination.x) {
            easterEgg.position.x += 1
        } else if (easterEgg.position.x > easterEgg.destination.x) {
            easterEgg.position.x -= 1
        } else if (easterEgg.position.y < easterEgg.destination.y) {
            easterEgg.position.y += 1
        } else if (easterEgg.position.y > easterEgg.destination.y) {
            easterEgg.position.y -= 1
        } else {
            easterEgg.destination = undefined;
        }
    } else {
        easterEgg.destination = {
            x: floor(random(windowWidth)),
            y: floor(random(windowHeight))
        }
    }
    image(easterEgg,easterEgg.position.x,easterEgg.position.y, 20, 20);
    text(status, windowWidth * 0.5 - 200, 400);
    image(video, windowWidth * 0.5 - videoWidth * 0.5, 50);
    textFont("Helvetica");
    fill(255).strokeWeight(2).textSize(25);
    text("Face Recognizer", windowWidth * 0.5 - 100, 30);
    fill(255).strokeWeight(0).textSize(17);
    if (capturedImage) {
        if (movingImage.active) {
            movingImage.y += 25;
            image(capturedImage, windowWidth * 0.5 - videoWidth * 0.5, movingImage.y);
            if (movingImage.y >= 430) {
                movingImage.active = false;
            }
        } else {
            image(capturedImage, windowWidth * 0.5 - videoWidth * 0.5, 430);
        }
    } else {
        status = "Press anywhere to take a photo for face recognition.";
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
    if (status === "Loading..") {
        return;
    }
    status = "Loading..";
    capturedImage = video.loadPixels();
    movingImage = {
        active: true,
        x: windowWidth * 0.5 - videoWidth * 0.5, 
        y: 50
    };
    video = createCapture(VIDEO);
    video.size(videoWidth, videoHeight);
    video.hide();
    // Sending and receiving data in JSON format using POST mothod
    //
    xhr = new XMLHttpRequest();
    var url = "localhost:8080";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () { 
        if (xhr.status == 200) {
            status = xhr.responseText;
        } else {
            status = "Status code: " + xhr.status;
        }
        clearTimeout(currTimeout);
        currTimeout = setTimeout('capturedImage = undefined;', 5000);
    }
    var data = capturedImage.pixels;
    xhr.send(data);
}