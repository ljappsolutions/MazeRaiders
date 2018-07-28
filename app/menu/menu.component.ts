import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { Image } from "ui/image";
import { PositioningService } from '~/shared/services/positioning.service';
import { DatabaseSession } from '~/shared/models/dbSession';
import { NOTHING, NEWMAZE, CONTINUEMAZE } from '~/shared/constants';

@Component({
    selector: 'menu',
    templateUrl: './menu/menu.component.html',
    styleUrls: ['./menu/menu.component.css']
})
export class MenuComponent implements OnInit {
    @ViewChild("bottle") bottle: ElementRef;
    @ViewChild("jewels") jewels: ElementRef;
    @ViewChild("ingots") ingots: ElementRef;
    @ViewChild("coins") coins: ElementRef;
    private imageBottle: Image;
    private imageJewels: Image;
    private imageIngots: Image;
    private imageCoins: Image;
    private databaseSession = DatabaseSession.getInstance();

    get showContinue(): boolean{
        return this.databaseSession.currentMaze &&
            this.databaseSession.currentMaze.rawNodes &&
            this.databaseSession.currentMaze.rawNodes.length > 0;
    }
    
    constructor(private router: RouterExtensions
        , private positioningService: PositioningService) { }

    
    ngOnInit() { 
        this.imageBottle = <Image>this.bottle.nativeElement;
        this.imageJewels = <Image>this.jewels.nativeElement;
        this.imageIngots = <Image>this.ingots.nativeElement;
        this.imageCoins = <Image>this.coins.nativeElement;
        this.positioningService.setTop(this.imageBottle, .8);
        this.positioningService.setLeft(this.imageBottle, .85);
        this.positioningService.setTop(this.imageIngots, 0);
        this.positioningService.setLeft(this.imageIngots, .80);
        this.positioningService.setTop(this.imageJewels, 0);
        this.positioningService.setLeft(this.imageJewels, .05);
        this.positioningService.setTop(this.imageCoins, .75);
        this.positioningService.setLeft(this.imageCoins, .05);
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
}