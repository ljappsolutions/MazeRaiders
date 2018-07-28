import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
    selector: 'options',
    templateUrl: './options/options.component.html',
    styleUrls: ['./options/options.component.css']
})

export class OptionsComponent implements OnInit {
    constructor(private router: RouterExtensions) { }

    ngOnInit() { }

    onBack(){
        this.router.navigate([""], { clearHistory: true });
    }
}