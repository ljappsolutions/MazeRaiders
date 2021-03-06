import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { StackLayout } from 'ui/layouts/stack-layout';
import { DockLayout} from 'ui/layouts/dock-layout';
import { Image } from 'ui/image';
import { Button } from 'ui/button';

import { MazeGeneratorService } from '~/shared/services/maze-generator.service';
import { Maze } from '~/shared/models/maze';
import { ScreenConfig } from '~/shared/models/screen-config';
import { PositioningService } from '~/shared/services/positioning.service';
import { DatabaseSession } from '~/shared/models/dbSession';
import { ActivatedRoute } from '@angular/router';
import { CONTINUEMAZE, NORTH, iosClientId, pcTestId, isAdTesting } from '~/shared/constants';
import { Player } from '~/shared/models/player';
import { TNSPlayer } from 'nativescript-audio';
import { createBanner, AD_SIZE } from 'nativescript-admob';

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
    private databaseSession = DatabaseSession.getInstance();

    get pointProgress(): string{
        return `${this.maze.player.points}/${this.maze.maxPoints}`; 
    }

    get isFirstStep(): boolean{
        return this.maze.stepCount === 0;
    }

    constructor(private router: RouterExtensions
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
        this.initSounds();
        this.setupAdBanner();
    }

    setupAdBanner(){
        createBanner({
            testing: isAdTesting,
            size: AD_SIZE.FLUID,
            iosBannerId: iosClientId,
            iosTestDeviceIds: [ pcTestId ],
            margins: {
                top: 10
            },
        }).then(function() {
        }, function(error) {
            console.log("admob banner error: " + error);
        });
    }

    private bagSound: TNSPlayer;
    private movementSound: TNSPlayer;
    private backgroundMusic: TNSPlayer;
    private initSounds(){
        this.bagSound = new TNSPlayer();
        this.movementSound = new TNSPlayer();
        this.backgroundMusic = new TNSPlayer();
        if(this.databaseSession.effects){
            this.bagSound.initFromFile({
                audioFile: "~/sounds/bag.wav",
                loop: false,
                autoPlay: false
            });
            this.movementSound.initFromFile({
                audioFile: "~/sounds/steps.wav",
                loop: false,
                autoPlay: false
            });
        }
        if(this.databaseSession.backgroundMusic) {
            this.backgroundMusic.initFromFile({
                audioFile: "~/sounds/mazebackground.mp3",
                loop: true
            });
            this.backgroundMusic.play();
        }
    }

    private unloadAllMusic(){
        this.bagSound.pause();
        this.bagSound.dispose();
        this.movementSound.pause();
        this.movementSound.dispose();
        this.backgroundMusic.pause();
        this.backgroundMusic.dispose();
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
        this.positioningService.setTop(this.playerMenu, 0.05);
        this.positioningService.setLeft(this.playerMenu, -1);
        this.positioningService.setTop(this.playerMap, -1);
        this.playerMenu.opacity = 0;
        this.playerMap.opacity = 0;
    }

    animating: boolean = false;
    private duration = 600;
    private doMovement(baseMaze: StackLayout, action){
        this.animating = true;
        if(this.databaseSession.effects)
            this.movementSound.play();
        baseMaze.animate({
            opacity: 0,
            duration: this.duration
        }).then((() => {
            this.maze.stepCount++;
            action();
            this.currentScreen = this.maze.getCurrentScreen();
            if(this.currentScreen.isExit){
                this.unloadAllMusic();
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
        if(this.databaseSession.effects)
            this.bagSound.play();
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
            translate: { x: 1.05*this.positioningService.getScreenWidth(), y: 0 },
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

    saveAndExitTap(){
        this.databaseSession.currentMaze = this.maze.getDatabaseObject();
        this.unloadAllMusic();
        this.router.navigate([""], { clearHistory: true });
    }
}