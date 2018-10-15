import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Admob from "nativescript-admob";
import { iosInterstitialId, pcTestId, NOTHING, isAdTesting } from '~/shared/constants';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout/dock-layout';
import { PhoneDetectorService } from '~/shared/services/phone-detector.service';
import { DatabaseSession } from '~/shared/models/dbSession';

@Component({
    selector: 'end-game',
    templateUrl: './end-game/end-game.component.html',
    styleUrls: ['./end-game/end-game.component.css']
})
export class EndGameComponent implements OnInit {
    @ViewChild("results") resultsRef: ElementRef;
    gameMessage: string = "";
    private results: DockLayout;
    private totalPoints: number = 0;
    private databaseSession = DatabaseSession.getInstance();

    get points(): string {
        return this.totalPoints + 'pts';
    }

    constructor(private activatedRoute: ActivatedRoute
        , private router: RouterExtensions
        , private phoneDetector: PhoneDetectorService) { }

    ngOnInit() { 
        this.results = <DockLayout>this.resultsRef.nativeElement;
        if(this.phoneDetector.isPlusModel()){
            this.results.paddingTop = 120;
        }else{
            this.results.paddingTop = 100;
        }

        this.databaseSession.currentMaze = NOTHING;
        this.activatedRoute.params.subscribe(params => {
            this.totalPoints = +params["score"];
            let currentMaxPoints = this.databaseSession.maxPoints;
            if(this.totalPoints > currentMaxPoints){
                this.databaseSession.maxPoints = this.totalPoints;
                this.gameMessage = "New Score!!"
            }else{
                this.gameMessage = "Finished!"
            }
            this.createInterstitial();
        });
    }

    goHome(){
        this.router.navigate([""], { clearHistory: true });
    }

    private createInterstitial() {
        Admob.createInterstitial({
            testing: isAdTesting,
            iosInterstitialId: iosInterstitialId,
            iosTestDeviceIds: [ pcTestId ]
        }).then(function() {
        }, function(error) {
            console.log("admob createInterstitial error: " + error);
        });
    }
}
