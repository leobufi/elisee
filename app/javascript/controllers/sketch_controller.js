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
    console.log("Hello from P5 controller")
    console.log(this.keyValue);

    window.setup = () => {
      createCanvas (windowWidth, windowHeight, WEBGL);
      colorMode(RGB);
    }

    window.draw = () => {
      background(255, 255, 255);
      stroke(255, 255, 60);

      if (this.keyValue === 0) {
        fill(color(229, 40, 18));
      } else if (this.keyValue === 1) {
        fill(color(237, 109, 5));
      } else if (this.keyValue === 2) {
        fill(color(245, 157, 0));
      } else if (this.keyValue === 3) {
        fill(color(252, 190, 0));
      } else if (this.keyValue === 4) {
        fill(color(254, 211, 0));
      } else if (this.keyValue === 5) {
        fill(color(201, 202, 0));
      } else if (this.keyValue === 6) {
        fill(color(0, 104, 39));
      } else if (this.keyValue === 7) {
        fill(color(103, 149, 30));
      } else if (this.keyValue === 8) {
        fill(color(2, 72, 111));
      } else if (this.keyValue === 9) {
        fill(color(48, 39, 131));
      } else if (this.keyValue === 10) {
        fill(color(90, 32, 118));
      } else if (this.keyValue === 11) {
        fill(color(95, 53, 88));
      }

      rotateX(frameCount * 0.02);
      rotateY(frameCount * 0.02);
      sphere(150);

    }
  }
}
