import { Controller } from "@hotwired/stimulus"
import { popper } from "@popperjs/core";
import { csrfToken } from "@rails/ujs";
import { normalizeOptions } from "webpack/lib/optimize/SplitChunksPlugin";

export default class extends Controller {
  static values = {
    duration: Number,
    key: Number,
    mode: Number,
    tempo: Number,
    timeSignature: Number,
    loudness: Number,
    id: Number,
    acousticness: Number,
    danceability: Number,
    energy: Number,
    instrumentalness: Number,
    valence: Number
  }

  static targets = ["likeForm", "canv", "likeFlash"]

  connect() {
    console.log("connected to P5 controller");
    console.log(`key is ${this.keyValue}`);
    console.log(`energy is ${this.energyValue}`);
    this._setupAll();
    this.randomDancers();
    this.randomEnergy();
    console.log(this.energyValue);
  }

  randomDancers () {
    let i = 0
    let dancers = Math.floor(this.danceabilityValue*20);
    this.dancerPositions = [];
    while (i < dancers) {
      let randomPositionX = this.between(-window.innerWidth/2, window.innerWidth/2);
      let randomPositionY = this.between(-window.innerHeight/2, window.innerHeight/2);
      let randomPositionZ = this.between(-300, 0);
      let position = [randomPositionX, randomPositionY, randomPositionZ];
      this.dancerPositions.push(position)
      i++
    }
  }

  randomEnergy () {
    let i = 0
    let energy = Math.floor(this.energyValue*100);
    this.energyPositions = [];
    while (i < energy) {
      let randomPositionX = this.between(-window.innerWidth/2, window.innerWidth/2);
      let randomPositionY = this.between(-window.innerHeight/2, window.innerHeight/2);
      let randomPositionZ = this.between(-300, 0);
      let position = [randomPositionX, randomPositionY, randomPositionZ];
      this.energyPositions.push(position)
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


  // LIKE BUTTON

  async like(e) {
    e.preventDefault();

    const form = new FormData
    const url = this.canvas.elt.toDataURL();
    form.append('song_id', this.idValue);
    form.append('like[image_url]', url);

    const options = {
      method: "POST",
      headers: { "Accept": "application/json", "X-CSRF-Token": csrfToken() },
      body: form
    }

    const response = await fetch(`/songs/${this.idValue}/like`, options);
    const data = await response.json();

    if (data.status === 'created') {
      this.likeFormTarget.classList.add("active");
      this._saveCanvasImageUrl();
      this.screenshot = true;
      setTimeout(() => {
        this.screenshot = false;
      }, 500);
      this.likeFlashTarget.classList.add("active");
      setTimeout(() => {
      this.likeFlashTarget.classList.remove("active");
      }, 2000);
      // window.location.href = "/dashboard";
    } else {
      this.likeFormTarget.classList.remove("active");
    }
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
      pixelDensity(1);
      smooth();
    }
  }

  _drawCanvas() {
    let retrievedUrl = false;

    window.draw = () => {

      const keyHue = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      const modeLightness = {
        0: 25,
        1: 75
      };

      let c = color(keyHue[this.keyValue], parseInt(this.energyValue * 100), modeLightness[this.modeValue]);
      let d = color(keyHue[this.keyValue], 100-(parseInt(this.energyValue * 100)), modeLightness[this.modeValue]);

      if (this.screenshot === true) {
        background(color(0, 0, 100));
      } else {
        background(d);
      }

      let brightC = brightness(c)
      stroke(brightC);

      directionalLight(0, 0, 100, -window.innerWidth/2, -window.innerHeight/2, -20);
      directionalLight(0, 0, 100, window.innerWidth/2, -window.innerHeight/2, -20);
      directionalLight(0, 0, 100, -window.innerWidth/2, window.innerHeight/2, 20);
      directionalLight(0, 0, 100, window.innerWidth/2, window.innerHeight/2, 20);

      fill(c);

      push()
      randomGaussian()
      rotateX(frameCount * this.tempoValue/10000);
      rotateY(frameCount * this.tempoValue/10000);
      rotateZ(frameCount * this.tempoValue/10000);
      torus(((this.instrumentalnessValue)*1000)/2, 100-((this.loudnessValue/-60)*100), 100-(Math.floor(this.acousticnessValue*100)), this.timeSignatureValue);
      pop()

      if (this.danceabilityValue > 0.5) {
        this.dancerPositions.forEach(position => {
          push();
          translate(
            position[0],
            position[1],
            position[2]),
            rotateX(frameCount * this.tempoValue/10000);
            rotateY(frameCount * this.tempoValue/10000);
            rotateZ(frameCount * this.tempoValue/10000);
            ellipsoid((this.energyValue)*150, 100-(Math.floor(this.acousticnessValue*100)), this.timeSignatureValue);
          pop();
          })
      } else {
        this.dancerPositions.forEach(position => {
          push();
          translate(
            position[0],
            position[1],
            position[2]),
            rotateX(frameCount * this.tempoValue/10000);
            rotateY(frameCount * this.tempoValue/10000);
            rotateZ(frameCount * this.tempoValue/10000);
            box((this.energyValue)*150, (this.acousticnessValue*100), this.timeSignatureValue*10);
          pop();
          })
      }

      this.energyPositions.forEach(position => {
        push();
          translate(
            position[0],
            position[1],
            -300),
          rotateY(frameCount * this.tempoValue/10000);
          square((this.energyValue)*150, (this.energyValue)*150, 100-(Math.floor(this.acousticnessValue*100)));
          fill(c);
        pop();
      })

      if (!retrievedUrl) {
      setTimeout(() => {
        this._saveCanvasImageUrl()
      }, 5000);
      retrievedUrl = true
      }
      // this.canvas.elt.toDataURL())
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
