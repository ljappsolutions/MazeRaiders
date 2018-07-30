import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import * as Admob from "nativescript-admob";
import { iosClientId, androidClientId, pcTestId } from '~/shared/constants';

@Component({
    selector: 'options',
    templateUrl: './options/options.component.html',
    styleUrls: ['./options/options.component.css']
})

export class OptionsComponent implements OnInit {
    constructor(private router: RouterExtensions) { }

    ngOnInit() { 
        this.createBanner();
    }

    onBack(){
        this.router.navigate([""], { clearHistory: true });
    }

    private createBanner() {
        Admob.createBanner({
            testing: true,
            size: Admob.AD_SIZE.BANNER,
            iosBannerId: iosClientId,
            androidBannerId: androidClientId,
            iosTestDeviceIds: [ pcTestId ]
        }).then(function() {
            console.log("admob createBanner done");
        }, function(error) {
            console.log("admob createBanner error: " + error);
        });
    }

    private hideBanner() {
        Admob.hideBanner().then(function() {
            console.log("admob hideBanner done");
        }, function(error) {
            console.log("admob hideBanner error: " + error);
        });
    }
}