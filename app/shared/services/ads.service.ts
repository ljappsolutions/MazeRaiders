import { Injectable } from '@angular/core';
import * as Admob from "nativescript-admob";

@Injectable()
export class AdsService {
    private iosClientId: string = "ca-app-pub-3122655011443262~3857696607";
    private androidInterstitialId: string = "ca-app-pub-3122655011443262/8698550628";
    private iosInterstitialId: string = "ca-app-pub-3122655011443262/5334429806";
    

    constructor() { }

    public createInterstitial() {
        Admob.createInterstitial({
            testing: false,
            iosInterstitialId: this.iosInterstitialId,
            androidInterstitialId: this.androidInterstitialId,
            iosTestDeviceIds: ["67B7E10C-F467-5F8D-BB5E-F3378975A541"]
        }).then(function() {
            console.log("admob createInterstitial done");
        }, function(error) {
            console.log("admob createInterstitial error: " + error);
        });
    }
}