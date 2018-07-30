import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Admob from "nativescript-admob";
import { iosInterstitialId, androidInterstitialId, pcTestId } from '~/shared/constants';

@Component({
    selector: 'end-game',
    templateUrl: './end-game/end-game.component.html',
    styleUrls: ['./end-game/end-game.component.css']
})
export class EndGameComponent implements OnInit {
    points: number = 0;

    constructor(private activatedRoute: ActivatedRoute
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
            iosInterstitialId: iosInterstitialId,
            androidInterstitialId: androidInterstitialId,
            iosTestDeviceIds: [ pcTestId ]
        }).then(function() {
            console.log("admob createInterstitial done");
        }, function(error) {
            console.log("admob createInterstitial error: " + error);
        });
    }
}
