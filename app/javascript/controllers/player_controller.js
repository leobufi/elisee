import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "play" ]

  connect() {
    console.log('player controller set, amigo !')
  }

  autoClick(e) {
    e.preventDefault();
    console.log(this.playTarget)
  }
}
