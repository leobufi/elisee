import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    duration: Number,
    key: Number,
    mode: Number,
    tempo: Number,
    timeSignature: Number,
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
      //directionalLight(0, 0, 100, 0, 0, -15);
      stroke(359, 0, 0);
      orbitControl();

      const keyHue = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      const modeLightness = {
        0: 25,
        1: 75
      };

      //ambientMaterial(keyHue[this.keyValue], 100-((this.loudnessValue/-60)*100), modeLightness[this.modeValue]);
      fill(color(keyHue[this.keyValue], 100-((this.loudnessValue/-60)*100), modeLightness[this.modeValue]));

      rotateX(frameCount * this.durationValue/10000);
      rotateY(frameCount * this.tempoValue/10000);
      rotateZ(frameCount * this.timeSignatureValue/10000);

      // applyMatrix(1, 1, 1, 0, 0, 0);
      sphere(this.tempoValue)
      torus(this.durationValue/1.5, 100-((this.loudnessValue/-60)*100), this.timeSignatureValue, this.timeSignatureValue);
      // console.log('drawing...', this.canvas.elt.toDataURL())
    }
  }
}
