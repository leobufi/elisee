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
    console.log("Hello from P5 controller");
    console.log(this.keyValue);

    window.setup = () => {
      createCanvas (windowWidth, windowHeight, WEBGL);
      colorMode(HSL);
      frameRate(90);
      noiseSeed(99);
    }

    window.draw = () => {
      background(0);
      stroke(359, 100, 100);

      const keyHue = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      const modeLightness = {
        0: 25,
        1: 75
      };

      fill(color(keyHue[this.keyValue], 100-((this.loudnessValue/-60)*100), modeLightness[this.modeValue]));

      rotateX(frameCount * 0.02);
      rotateY(frameCount * 0.02);
      rotateZ(millis(this.time_signatureValue) / 1000);

      applyMatrix(1, 1, 1, 0, 0, 0);
      sphere(90);
      torus(this.durationValue/2, this.loudnessValue*2, this.time_signatureValue, this.keyValue);
    }
  }
}
