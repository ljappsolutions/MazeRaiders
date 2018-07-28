import { Injectable } from '@angular/core';
import { AbsoluteLayout } from "ui/layouts/absolute-layout";
import { View } from 'ui/core/view';
import { screen } from "tns-core-modules/platform"

@Injectable()
export class PositioningService {

    constructor() { }

    setTop(element: View, offset: number){
        AbsoluteLayout.setTop(element, 
            screen.mainScreen.heightDIPs*offset);
    }

    setLeft(element: View, offset: number){
        AbsoluteLayout.setLeft(element, 
            screen.mainScreen.widthDIPs*offset);
    }

    getScreenWidth(){
        return screen.mainScreen.widthDIPs;
    }

    getScreenHeight(){
        return screen.mainScreen.heightDIPs;
    }
}