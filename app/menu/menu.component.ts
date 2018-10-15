import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Admob from "nativescript-admob";
import { DatabaseSession } from '~/shared/models/dbSession';
import { NEWMAZE, CONTINUEMAZE, pcTestId, iosInterstitialId, isAdTesting } from '~/shared/constants';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout/dock-layout';
import { PhoneDetectorService } from '~/shared/services/phone-detector.service';

@Component({
    selector: 'menu',
    templateUrl: './menu/menu.component.html',
    styleUrls: ['./menu/menu.component.css']
})
export class MenuComponent implements OnInit {
    @ViewChild("menuButtons") menuButtonsRef: ElementRef;
    private menuButtons: DockLayout;
    private databaseSession = DatabaseSession.getInstance();

    get showContinue(): boolean{
        return this.databaseSession.currentMaze &&
            this.databaseSession.currentMaze.rawNodes &&
            this.databaseSession.currentMaze.rawNodes.length > 0;
    }
    
    constructor(private router: RouterExtensions,
        private phoneDetector: PhoneDetectorService) { 
        }

    ngOnInit() { 
        this.menuButtons = <DockLayout>this.menuButtonsRef.nativeElement;
        if(this.phoneDetector.isPlusModel()){
            this.menuButtons.paddingTop = 140;
        }else{
            this.menuButtons.paddingTop = 120;
        }
        
        this.processAdDisplay();
    }

    onNewGameTap(){
        this.router.navigate([`maze/${NEWMAZE}`], { clearHistory: true });
    }

    onContinueTap(){
        this.router.navigate([`maze/${CONTINUEMAZE}`], { clearHistory: true })
    }

    onOptionsTap(){
        this.router.navigate(["options"], { clearHistory: true });
    }

    private processAdDisplay(){
        var currentTime = new Date().getTime();
        if(currentTime - this.databaseSession.lastAd > 2*60*1000){
            this.createInterstitial();
            this.databaseSession.lastAd = currentTime;
        }
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