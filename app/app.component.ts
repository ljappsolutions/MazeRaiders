import { Component } from "@angular/core";
var orientation = require('nativescript-orientation');

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  
  constructor() {
    orientation.setOrientation("landscape");
    orientation.disableRotation();
  }
}