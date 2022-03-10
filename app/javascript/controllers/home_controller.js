import { Controller } from "@hotwired/stimulus"
import { popper } from "@popperjs/core";
import { csrfToken, linkClickSelector } from "@rails/ujs";
import { normalizeOptions } from "webpack/lib/optimize/SplitChunksPlugin";

export default class extends Controller {

  static values = {
    font: String
  }

  connect() {
    console.log("connected to HOME P5 controller");
    this._setupAll();
    this.randomSpheres();
  }

  randomSpheres () {
    let i = 0;
    let spheres = this.between(2, 5)
    this.spheresPositions = [];
    while (i < spheres) {
      let randomPositionX = this.between(-window.innerWidth/3, window.innerWidth/3);
      let randomPositionY = this.between(-window.innerHeight/3, window.innerHeight/3);
      let randomPositionZ = this.between(-300, 0);
      let position = [randomPositionX, randomPositionY, randomPositionZ];
      this.spheresPositions.push(position);
      i++
    }
  }

  between(min, max) {
    return Math.floor(
    Math.random() * (max - min + 1) + min
  )
  }

  disconnect() {
    console.log('disconnected')
    window.setup = () => {}
    window.draw = () => {}
  }

  _setupPreload() {
    window.preload = () => {
      this.myFont = loadFont(this.fontValue);
    }
  }

  _setupAll() {
    this._setupPreload()
    this._setupWindow()
    this._drawCanvas()
  }

  _setupWindow() {
    window.setup = () => {
      this.canvas = createCanvas(windowWidth, windowHeight, WEBGL);
      // this.elisee = createGraphics(windowWidth, windowHeight);

      colorMode(HSL);
      frameRate(75);
      smooth();

      this.c = color(this.between(0,359), this.between(50,100), this.between(25,75));
      this.d = color(this.between(0,359), this.between(50,100), this.between(25,75));
      this.e = color(this.between(0,359), this.between(50,100), this.between(25,75));

      this.elisee = createGraphics(200, 200)
      this.elisee.textFont(this.myFont);
      this.elisee.fill(this.d)
      this.elisee.textSize(65);
      this.elisee.textAlign(CENTER);
      this.elisee.text('élisée', 100, 100);

    }
  }

  _drawCanvas() {

    window.draw = () => {


      background(this.c);
      stroke(this.e);

      // directionalLight(0, 0, 100, -window.innerWidth/2, -window.innerHeight/2, -10);
      // directionalLight(0, 0, 100, window.innerWidth/2, -window.innerHeight/2, -10);
      // directionalLight(0, 0, 100, -window.innerWidth/2, window.innerHeight/2, 0);
      // directionalLight(0, 0, 100, window.innerWidth/2, window.innerHeight/2, 0);

      push();
        translate(-window.innerWidth/2.75, -window.innerHeight/3.25, 10),
        rotateY(frameCount * -0.01);
        texture(this.elisee);
        sphere(100, 24, 16);
      pop();


      // this.spheresPositions.forEach(position => {
      //   push();
      //     translate(
      //       position[0],
      //       position[1],
      //       position[2]
      //     ),
      //     rotateY(frameCount * -0.01);

      //     texture(this.elisee);
      //     sphere(100, 24, 16);
      //     line()
      //   pop();
      // })
    }
  }

}
