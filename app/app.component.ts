import { Component } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  
  constructor(private page: Page) {
  }
}