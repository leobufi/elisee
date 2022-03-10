// app/javascript/controllers/typed_js_controller.js
import { Controller } from "@hotwired/stimulus"
// Don't forget to import the NPM package
import Typed from "typed.js"

export default class extends Controller {
  static values = {
    keyMode: String,
    tempo: String,
    danceabilityLevel: String,
    energyLevel: String
  }
  connect() {
    new Typed(this.element, {
      strings: ["", `${this.keyModeValue}^1000\n${this.tempoValue}^1000\n${this.danceabilityLevelValue}^1000\n ${this.energyLevelValue}`],
      typeSpeed: 50,
      loop: false,
      backSpeed: 0,
    });
  }
}
