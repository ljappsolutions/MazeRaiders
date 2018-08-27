import { Injectable } from "@angular/core";
import { screen } from 'platform';

@Injectable()
export class PhoneDetectorService {
    constructor() {}

    isPlusModel(){
        return screen.mainScreen.heightDIPs > 400;
    }
}