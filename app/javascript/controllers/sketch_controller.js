import { Controller } from "@hotwired/stimulus"
import { csrfToken } from "@rails/ujs";

export default class extends Controller {
  static values = {
    duration: Number,
    key: Number,
    mode: Number,
    tempo: Number,
    time_signature: Number,
    loudness: Number,
    id: Number
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
    let retrievedUrl = false
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
      cone(this.durationValue/2, this.loudnessValue*2, this.time_signatureValue, this.keyValue);

      // console.log(this.canvas.elt.toDataURL())
      if (!retrievedUrl) {
        this._saveCanvasImageUrl()
        retrievedUrl = true
      }
      // this.canvas.elt.toBlob((blob) => {
      //   // var newImg = document.createElement('img'),
      //   const url = URL.createObjectURL(blob);

      //   // newImg.onload = function() {
      //     // no longer need to read the blob so it's revoked
      //     // URL.revokeObjectURL(url);
      //     // };

      //     console.log(blob)
      //     // newImg.src = url;
      //     // document.body.appendChild(newImg);
      //   });
      // }
    }

  }

  _saveCanvasImageUrl() {
    const url = this.canvas.elt.toDataURL()
    const data = new FormData()

    data.append('song[image_url]', url)
    data.append('id', this.idValue)

    this._fetchWithToken(`/attach_image_url`, {
      method: 'POST',
      headers: { 'Accept-Content': 'application/json'},
      body: data
    })
  }


  _fetchWithToken(url, options) {
    options.headers = {
      "X-CSRF-Token": csrfToken(),
      ...options.headers
    };

    return fetch(url, options);
  }
}
