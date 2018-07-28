import { Player } from "~/shared/models/player";
import { MazeNode } from "~/shared/models/maze-node";
import * as constants from "~/shared/constants";
import { Coordinate } from "~/shared/models/coordinate";
import { ScreenConfig } from "~/shared/models/screen-config";
import { Bag } from "~/shared/models/bag";
import { IDatabaseObject } from "~/shared/models/database-object";

export class Maze implements IDatabaseObject{
    nodes: Array<MazeNode[]>;
    player: Player;
    maxPoints: number = 0;
    stepCount: number = 0;

    constructor(private rawNodes: any, private steps: number){
        this.nodes = [];
        if(rawNodes){
            rawNodes.forEach(lineNodes => {
                var currentLine = [];
                lineNodes.forEach(rawNode => {
                    let node = new MazeNode(rawNode);
                    currentLine.push(node);
                    this.maxPoints += node.bag ? node.bag.value : 0;
                });
                this.nodes.push(currentLine);
            });
        }
        this.stepCount = steps;
    }

    getDatabaseObject(): any{
        return {
            player: this.player.getDatabaseObject(),
            rawNodes: this.nodes.map(x => x.map(node => node.getDatabaseObject())),
            steps: this.stepCount
        }
    }

    isPlayerIn(x: number, y: number): boolean{
        return x == this.player.x && y == this.player.y;
    }

    getCurrentScreen(): ScreenConfig{
        var currentNode: MazeNode = this.getCurrentNode(this.player.location);
        if(!currentNode){
            return new ScreenConfig(null, false, false, false, true);
        }
        currentNode.seen = true;
        let screenConfig: ScreenConfig = null;
        switch(this.player.heading){
            case constants.NORTH:
                screenConfig = currentNode.getHeadingNorthScreen();
                break;
            case constants.WEST:
                screenConfig = currentNode.getHeadingWestScreen();
                break;
            case constants.SOUTH:
                screenConfig = currentNode.getHeadingSouthScreen();
                break;
            case constants.EAST:
                screenConfig = currentNode.getHeadingEastScreen();
                break;
            default:
                return null;
        }
        screenConfig.bag = currentNode.bag;
        return screenConfig;
    }

    pickBag(){
        var currentNode = this.getCurrentNode(this.player.location);
        this.player.addItem(currentNode.bag);
        currentNode.bag = null;
    }

    private getCurrentNode(location: Coordinate): MazeNode{
        if(location.x < this.nodes.length && location.y < this.nodes[location.x].length){
            return this.nodes[location.x][location.y];
        }
        return null;
    }

    moveLeft(){
        this.player.moveLeft();   
    }

    moveFront(){
        this.player.moveFront();
    }

    moveRight(){
        this.player.moveRight();
    }

    moveBack(){
        this.player.moveBack();
    }
}