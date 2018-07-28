import { Component, OnInit } from '@angular/core';
import { AdsService } from '~/shared/services/ads.service';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Admob from "nativescript-admob";

@Component({
    selector: 'end-game',
    templateUrl: './end-game/end-game.component.html',
    styleUrls: ['./end-game/end-game.component.css']
})
export class EndGameComponent implements OnInit {
    points: number = 0;
    private iosClientId: string = "ca-app-pub-3122655011443262~3857696607";
    private androidInterstitialId: string = "ca-app-pub-3122655011443262/8698550628";
    private iosInterstitialId: string = "ca-app-pub-3122655011443262/5334429806";

    constructor(private adsService: AdsService
        , private activatedRoute: ActivatedRoute
        , private router: RouterExtensions) { }

    ngOnInit() { 
        this.createInterstitial();

        this.activatedRoute.params.subscribe(params => {
            this.points = +params["score"];
            console.log(this.points);
        });
    }

    goHome(){
        this.router.navigate([""], { clearHistory: true });
    }

    public createInterstitial() {
        Admob.createInterstitial({
            testing: true,
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
