import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Page, Color, isIOS } from 'tns-core-modules/ui/page/page';
import { setTimeout } from 'tns-core-modules/timer';
import { RouterExtensions } from 'nativescript-angular/router';
import { StackLayout } from 'ui/layouts/stack-layout';
import { DockLayout} from 'ui/layouts/dock-layout';
import { Image } from 'ui/image';
import { Button } from 'ui/button';

import { MazeGeneratorService } from '~/shared/services/maze-generator.service';
import { Maze } from '~/shared/models/maze';
import { ScreenConfig } from '~/shared/models/screen-config';
import { PositioningService } from '~/shared/services/positioning.service';
import { Bag } from '~/shared/models/bag';
import { DatabaseSession } from '~/shared/models/dbSession';
import { ActivatedRoute } from '@angular/router';
import { CONTINUEMAZE, NORTH } from '~/shared/constants';
import { Player } from '~/shared/models/player';

@Component({
    selector: 'maze',
    templateUrl: './maze/maze.component.html',
    styleUrls: ['./maze/maze.component.css']
})
export class MazeComponent implements OnInit {
    @ViewChild("bag") bag: ElementRef;
    @ViewChild("playerMenuBtn") playerMenuBtn: ElementRef;
    @ViewChild("playerMapBtn") playerMapBtn: ElementRef;
    @ViewChild("playerMenu") playerMenuRef: ElementRef;
    @ViewChild("playerMap") playerMapRef: ElementRef;

    currentScreen: ScreenConfig;
    isBusy: boolean = false;
    private maze: Maze;
    private imageBag: Image;
    private playerMenuButton: Button;
    private playerMapButton: Button;
    private playerMenu: DockLayout;
    private playerMap: DockLayout;

    get pointProgress(): string{
        return `${this.maze.player.points}/${this.maze.maxPoints}`; 
    }

    get isFirstStep(): boolean{
        return this.maze.stepCount === 0;
    }

    constructor(private page: Page
        , private router: RouterExtensions
        , private mazeGeneratorService: MazeGeneratorService
        , private positioningService: PositioningService
        , private activatedRoute: ActivatedRoute) { 
    }

    ngOnInit() { 
        this.imageBag = <Image>this.bag.nativeElement;
        this.playerMenuButton = <Button>this.playerMenuBtn.nativeElement;
        this.playerMapButton = <Button>this.playerMapBtn.nativeElement;
        this.playerMenu = <DockLayout>this.playerMenuRef.nativeElement;
        this.playerMap = <DockLayout>this.playerMapRef.nativeElement;
        this.positionItems();

        this.isBusy = true;
        this.activatedRoute.params.subscribe(params => {
            if(params["option"] === CONTINUEMAZE){
                this.setExistingMaze();
            }else{
                this.setNewMaze();
            }
        });
    }

    private setNewMaze(){
        this.mazeGeneratorService.getMaze().then(data => {
            if(data){                
                this.maze = new Maze(data.maze, 0);
                this.maze.player = new Player({heading: NORTH, x: 0, y: 2, bag: [] });
                this.currentScreen = this.maze.getCurrentScreen();
                this.isBusy = false;
            }else{
                this.router.navigate(["/connectionError"], { clearHistory: true });
            }
        });
    }

    private setExistingMaze(){
        var maze = this.databaseSession.currentMaze;
        this.maze = new Maze(maze.rawNodes, maze.steps);
        this.maze.player = new Player(maze.player);
        this.currentScreen = this.maze.getCurrentScreen();
        this.isBusy = false;
    }

    private positionItems(){
        this.positioningService.setTop(this.imageBag, .6);
        this.positioningService.setLeft(this.imageBag, 0.05);
        this.positioningService.setTop(this.playerMenuButton, .84);
        this.positioningService.setLeft(this.playerMenuButton, 0.91);
        this.positioningService.setTop(this.playerMapButton, .84);
        this.positioningService.setLeft(this.playerMapButton, 0.82);
        this.positioningService.setTop(this.playerMenu, 0.1);
        this.positioningService.setLeft(this.playerMenu, -1);
        this.positioningService.setTop(this.playerMap, -1);
        this.playerMenu.opacity = 0;
        this.playerMap.opacity = 0;
    }

    animating: boolean = false;
    private duration = 500;
    private doMovement(baseMaze: StackLayout, action){
        this.animating = true;
        baseMaze.animate({
            opacity: 0,
            duration: this.duration
        }).then((() => {
            this.maze.stepCount++;
            action();
            this.currentScreen = this.maze.getCurrentScreen();
            if(this.currentScreen.isExit){
                this.router.navigate([`endGame/${this.maze.player.points}`], { clearHistory: true });
            }else{
                baseMaze.animate({
                    opacity: 1,
                    duration: this.duration
                }).then(() => {
                    this.animating = false;
                    if(this.currentScreen.bag){
                        this.animateBag();
                    }
                });
            }
        }));
    }

    private animateBag(){
        this.bag.nativeElement.src = "~/images/bag-glow.png";
        this.imageBag.animate({
            scale: {x:1.1, y:1.1},
            duration: this.duration/2
        }).then(() => {
            this.imageBag.animate({
                scale: {x:1, y:1},
                duration: this.duration/2
            }).then(() => {
                this.bag.nativeElement.src = "~/images/bag-white-glow.png";
            });
        });
    }

    getBackground(){
        if(!this.currentScreen) return {};
        return {
            "background-image": `url('${this.currentScreen.backgroundImage}');`
        };
    }

    onFrontTap(baseMaze: StackLayout){
        this.doMovement(baseMaze, () => {
            this.maze.moveFront();
        });
    }

    onBackTap(baseMaze: StackLayout){
        this.doMovement(baseMaze, () => {
            this.maze.moveBack();
        });
    }

    onLeftTap(baseMaze: StackLayout){
        this.doMovement(baseMaze, () => {
            this.maze.moveLeft();
        });
    }

    onRightTap(baseMaze: StackLayout){
        this.doMovement(baseMaze, () => {
            this.maze.moveRight();
        });
    }

    addBagToPlayer(){
        this.maze.pickBag();
        this.currentScreen.bag = null;
    }

    getBagVisibility(){
        return this.currentScreen && !this.animating 
            && this.currentScreen.bag ? 'visible' : 'hidden';
    }

    getFloatingBtnVisibility(){
        return this.currentScreen && !this.animating 
            ? 'visible' : 'hidden';
    }

    private isFloatingAnimating: boolean = false;
    onMenuTap(){
        if(this.isFloatingAnimating) return;
        this.isFloatingAnimating = true;
        this.playerMenu.animate({
            translate: { x: 1.1*this.positioningService.getScreenWidth(), y: 0 },
            opacity: 1,
            duration: this.duration
        }).then(() => {
            this.isFloatingAnimating = false;
        });
    }

    onMapTap(){
        if(this.isFloatingAnimating) return;
        this.isFloatingAnimating = true;
        this.playerMap.animate({
            opacity: 1,
            translate: { x: 0, y: 1*this.positioningService.getScreenHeight()},
            duration: this.duration
        }).then(() => {
            this.isFloatingAnimating = false;
        });
    }

    onCloseMenuTap(){
        if(this.isFloatingAnimating) return;
        this.isFloatingAnimating = true;
        this.playerMenu.animate({
            translate: { x: -1*this.positioningService.getScreenWidth(), y: 0 },
            opacity: 0,
            duration: this.duration
        }).then(() => {
            this.isFloatingAnimating = false;
        });
    }

    onCloseMapTap(){
        if(this.isFloatingAnimating) return;
        this.isFloatingAnimating = true;
        this.playerMap.animate({
            opacity: 0,
            translate: { x: 0, y: -1*this.positioningService.getScreenHeight()},
            duration: this.duration
        }).then(() => {
            this.isFloatingAnimating = false;
        });
    }

    private databaseSession = DatabaseSession.getInstance();
    saveAndExitTap(){
        this.databaseSession.currentMaze = this.maze.getDatabaseObject();
        this.router.navigate([""], { clearHistory: true });
    }
}