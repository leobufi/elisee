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
    this._setupAll();
    this.randomDancers();
    this.randomEnergy();
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
      frameRate(100);
      pixelDensity(1);
      smooth();
      console.log(`duration is ${this.durationValue}`);
      console.log(`key is ${this.keyValue}`);
      console.log(`mode is ${this.modeValue}`);
      console.log(`tempo is ${this.tempoValue}`);
      console.log(`timeSignature is ${this.timeSignatureValue}`);
      console.log(`loudness is ${this.loudnessValue}`);
      console.log(`acousticness is ${this.acousticnessValue}`);
      console.log(`danceability is ${this.danceabilityValue}`);
      console.log(`energy is ${this.energyValue}`);
      console.log(`instrumentalness is ${this.instrumentalnessValue}`);
      console.log(`valence is ${this.valenceValue}`);
    }
  }

  _drawCanvas() {
    let retrievedUrl = false;

    window.draw = () => {

      // calcul loudness/saturation : 100-(this.loudnessValue/-60)*100);

      // COLOR SETUP : KEY = TEINTE, ENERGY = SATURATION, MODE = LUMIÈRE;

      const keyHue = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      const modeLightness = {
        0: 25,
        1: 75
      };

      let c = color(keyHue[this.keyValue], parseInt(this.energyValue * 10000), modeLightness[this.modeValue]);
      let d = color(keyHue[this.keyValue], 100-(parseInt(this.energyValue * 10000)), modeLightness[this.modeValue]);

      if (this.screenshot === true) {
        background(color(0, 0, 100));
      } else {
        background(d);
      }


      let brightC = brightness(c)
      stroke(brightC);

      // 4 LUMIERE SETUP

      directionalLight(0, 0, 100, -window.innerWidth/2, -window.innerHeight/2, 0);
      directionalLight(0, 0, 100, window.innerWidth/2, -window.innerHeight/2, 0);
      directionalLight(0, 0, 100, -window.innerWidth/2, window.innerHeight/2, 0);
      directionalLight(0, 0, 100, window.innerWidth/2, window.innerHeight/2, 0);

      // SHAPES SETUP
      // 1. MAIN SHAPE :
      // - ROTATION = 100 FRAMECOUNT PER SECOND * TEMPO VALUE (BPM) / 10000;
      // - SHAPE = TORUS
      //     TAILLE = ENERGY > PLUS LA MUSIQUE EST ENERGIQUE, PLUS L'OBJET EST GRAND.
      //     LARGEUR = INSTRUMENTATION > PLUS LA MUSIQUE EST INSTRUMENTALE, PLUS L'OBJET EST LARGE.
      //     NBRE DE CÔTÉS = PLUS LA MUSIQUE EST ACOUSTIQUE, MOINS L'OBJET A DE COTÉS.

      push()
        rotateX(frameCount * this.tempoValue/10000);
        rotateY(frameCount * this.tempoValue/10000);
        rotateZ(frameCount * this.tempoValue/10000);
        noStroke();
        fill(c);
        torus((this.energyValue*1000), parseInt((this.instrumentalnessValue)*100), 100-(Math.floor(this.acousticnessValue*100)));
      pop()

      //2.DANCERS

      if (this.danceabilityValue > 0.67) {
        this.dancerPositions.forEach(position => {
          push();
            translate(
              position[0],
              position[1],
              position[2]
            ),
            rotateX(frameCount * this.tempoValue/10000);
            rotateY(frameCount * this.tempoValue/10000);
            rotateZ(frameCount * this.tempoValue/10000);
            fill(c);
            ellipsoid((this.instrumentalnessValue)*150, this.valenceValue*100, this.timeSignatureValue*10);
          pop();
        })
      } else if (this.danceabilityValue < 0.67 && this.danceabilityValue > 0.33) {
        this.dancerPositions.forEach(position => {
          push();
            translate(
              position[0],
              position[1],
              position[2]
            ),
            rotateX(frameCount * this.tempoValue/10000);
            rotateY(frameCount * this.tempoValue/10000);
            rotateZ(frameCount * this.tempoValue/10000);
            fill(c);
            cylinder(this.instrumentalnessValue*100, this.valenceValue*100, this.timeSignatureValue);
          pop();
        })
      } else {
        this.dancerPositions.forEach(position => {
          push();
            translate(
              position[0],
              position[1],
              position[2]
            ),
            rotateX(frameCount * this.tempoValue/10000);
            rotateY(frameCount * this.tempoValue/10000);
            rotateZ(frameCount * this.tempoValue/10000);
            fill(c);
            box(this.instrumentalnessValue*150, this.valenceValue*100, this.timeSignatureValue*10);
          pop();
        })
      }

      // 3.ENERGY/NOISE

      if (this.energyValue > 0.67) {
        this.energyPositions.forEach(position => {
          push();
            translate(
              position[0],
              position[1],
              position[2]
            ),
            rotateY(frameCount * this.tempoValue/10000);
            fill(c);
            box(this.energyValue*150, this.energyValue*150, 100-(Math.floor(this.acousticnessValue*100)));
          pop();
        })
      } else if (this.energyValue < 0.67 && this.energyValue > 0.33) {
        this.energyPositions.forEach(position => {
          push();
            translate(
              position[0],
              position[1],
              position[2]
            ),
            rotateY(frameCount * this.tempoValue/10000);
            fill(c);
            square(this.energyValue*150, this.energyValue*150, 100-(Math.floor(this.acousticnessValue*100)));
          pop();
        })
      } else {
        this.energyPositions.forEach(position => {
          push();
            translate(
              position[0],
              position[1],
              position[2]
            ),
            rotateY(frameCount * this.tempoValue/10000);
            fill(c);
            plane(this.energyValue*150, this.energyValue*150, 100-(Math.floor(this.acousticnessValue*100)));
          pop();
        })
      }

      // SAVING IMAGES FROM CANVA

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
