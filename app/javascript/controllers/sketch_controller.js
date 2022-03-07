import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    duration: Number,
    key: Number,
    mode: Number,
    tempo: Number,
    time_signature: Number,
    loudness: Number
  }

  connect() {
    console.log("connected to P5 controller");
    this._setupAll()
  }

  disconnect() {
    console.log('disconnected')
    window.setup = () => {}
    window.draw = () => {}
  }

  _setupAll() {
    this._setupWindow()
    this._drawCanvas()
  }

  _setupWindow() {
    window.setup = () => {
      console.log('setup inside')
      this.canvas = createCanvas(windowWidth, windowHeight, WEBGL);
      colorMode(HSL);
      frameRate(90);
    }
  }

  _drawCanvas() {
    window.draw = () => {
      background(0);
      colorMode(RGB, 255);



      // VALUES LOGS
      // console.log(`key is ${this.keyValue}`);
      // console.log(`key to rgb value equals ${f}`);
      console.log(`mode is ${this.modeValue}`);
      // console.log(`time_sig is ${this.time_signatureValue}`);
      // console.log(`duration is ${this.durationValue}`);


      // KEY TO COLORS
      const f = Math.floor((this.keyValue*255) / 11);
      const a = f + 80;
      const b = f - 80;

      if (f < 100) {
        // console.log(`rgb(${a + 100},${a},${f})`);
        fill(a + 100, a, f);
      } else if (f > 200) {
        // console.log(`rgb(${b},${b},${f})`);
        fill(b, b, f);
      } else {
        // console.log(`rgb(${a},${b},${f})`);
        fill(a, b, f);
      }

      // MODE TO SHAPES
      if (this.modeValue === 1) {
          for (let x = -750; x < windowWidth-100; x += 10) {
            circle(x, -250, 30, 30);
            translate(x, 0);
            if (x > windowWidth-100) {
              for (let y = -250; y <= windowHeight; y += 40) {
                circle(x, y, 30, 30);
                translate(x, y);
              }
            }
          }
      } else {
        for (let x = -750; x < windowWidth-100; x += 10) {
          rect(x, -250, 30, 30);
          translate(x, 0);
          if (x > windowWidth-100) {
            for (let y = -250; y <= windowHeight; y += 40) {
              rect(x, y, 30, 30);
              translate(x, y);
            }
          }
        }
      }



      // TEMPO TO MOVEMENT
      noLoop();

      // console.log('drawing...', this.canvas.elt.toDataURL())
    }
  }
}
