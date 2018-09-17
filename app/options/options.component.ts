import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { DockLayout } from 'tns-core-modules/ui/layouts/dock-layout/dock-layout';
import { PhoneDetectorService } from '~/shared/services/phone-detector.service';
import { DatabaseSession } from '~/shared/models/dbSession';
import { Switch } from "ui/switch";

@Component({
    selector: 'options',
    templateUrl: './options/options.component.html',
    styleUrls: ['./options/options.component.css']
})

export class OptionsComponent implements OnInit {
    @ViewChild("options") optionsRef: ElementRef;
    private options: DockLayout;
    private userOptions = DatabaseSession.getInstance();
    
    constructor(private router: RouterExtensions
        , private phoneDetector: PhoneDetectorService) { }

    ngOnInit() { 
        this.options = <DockLayout>this.optionsRef.nativeElement;
        if(this.phoneDetector.isPlusModel()){
            this.options.paddingTop = 120;
        }else{
            this.options.paddingTop = 100;
        }
    }

    onBack(){
        this.router.navigate([""], { clearHistory: true });
    }

    get backgroundMusic(): boolean {
        return this.userOptions.backgroundMusic;
    }

    public onBackgroundMusicChange(args) {
        let backgroundMusic = <Switch>args.object;
        this.userOptions.backgroundMusic = backgroundMusic.checked;
    }

    get effects(): boolean {
        return this.userOptions.effects;
    }

    public onEffectsChange(args) {
        let effects = <Switch>args.object;
        this.userOptions.effects = effects.checked;
    }
}