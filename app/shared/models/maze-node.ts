import { Bag } from "~/shared/models/bag";
import { ScreenConfig } from "~/shared/models/screen-config";
import * as constants from "~/shared/constants";
import { IDatabaseObject } from "~/shared/models/database-object";

export class MazeNode implements IDatabaseObject{
    hasNorth: boolean;
    isNorthExit: boolean;
    hasWest: boolean;
    isWestExit: boolean;
    hasSouth: boolean;
    isSouthExit: boolean;
    hasEast: boolean;
    isEastExit: boolean;
    bag: Bag;
    seen: boolean;

    constructor(private rawNode: any){
        if(rawNode){
            this.hasNorth = rawNode.hasNorth ? rawNode.hasNorth : false;
            this.isNorthExit = rawNode.isNorthExit ? rawNode.isNorthExit : false; 
            this.hasWest = rawNode.hasWest ? rawNode.hasWest :      false; 
            this.isWestExit = rawNode.isWestExit ? rawNode.isWestExit : false; 
            this.hasSouth = rawNode.hasSouth ? rawNode.hasSouth : false; 
            this.isSouthExit = rawNode.isSouthExit ? rawNode.isSouthExit : false; 
            this.hasEast = rawNode.hasEast ? rawNode.hasEast : false; 
            this.isEastExit = rawNode.isEastExit ? rawNode.isEastExit : false; 
            this.seen = rawNode.seen ? true : false;
            this.bag = rawNode.bag ? new Bag(rawNode.bag) : null;
        }
    }

    getDatabaseObject(): any{
        return {
            hasNorth: this.hasNorth,
            isNorthExit: this.isNorthExit,
            hasWest: this.hasWest,
            isWestExit: this.isWestExit,
            hasSouth: this.hasSouth,
            isSouthExit: this.isSouthExit,
            hasEast: this.hasEast,
            isEastExit: this.isEastExit,
            bag: this.bag ? this.bag.getDatabaseObject() : null,
            seen: this.seen
        }
    }

    getClassName(){
        var className = !this.seen ? 'not-seen' :
            `seen ${!this.hasNorth?'north':''} ${!this.hasSouth?'south':''} ${!this.hasWest?'west':''} ${!this.hasEast?'east':''}`;
        return className;
    }

    private isExit(exit: boolean){
        return exit?'E':'';
    }

    getHeadingNorthScreen(): ScreenConfig{
        if(!this.hasNorth && !this.hasWest && !this.hasEast)
            return new ScreenConfig(constants.BLOCKED, false, false, false);
        if(this.hasNorth && !this.hasWest && !this.hasEast)
            return new ScreenConfig(`~/images/F${this.isExit(this.isNorthExit)}1.png`, false, true, false);
        if(this.hasNorth && this.hasWest && !this.hasEast)
            return new ScreenConfig(`~/images/L${this.isExit(this.isWestExit)}F${this.isExit(this.isNorthExit)}1.png`, true, true, false);
        if(this.hasNorth && !this.hasWest && this.hasEast)
            return new ScreenConfig(`~/images/F${this.isExit(this.isNorthExit)}R${this.isExit(this.isEastExit)}1.png`, false, true, true);
        if(this.hasNorth && this.hasWest && this.hasEast)
            return new ScreenConfig(`~/images/L${this.isExit(this.isWestExit)}F${this.isExit(this.isNorthExit)}R${this.isExit(this.isEastExit)}1.png`, true, true, true);
        if(!this.hasNorth && this.hasWest && this.hasEast)
            return new ScreenConfig(`~/images/L${this.isExit(this.isWestExit)}R${this.isExit(this.isEastExit)}1.png`, true, false, true);
        if(!this.hasNorth && !this.hasWest && this.hasEast)
            return new ScreenConfig(`~/images/R${this.isExit(this.isEastExit)}1.png`, false, false, true);
        if(!this.hasNorth && this.hasWest && !this.hasEast)
            return new ScreenConfig(`~/images/L${this.isExit(this.isWestExit)}1.png`, true, false, false);
    }

    getHeadingWestScreen(): ScreenConfig{
        if(!this.hasNorth && !this.hasWest && !this.hasSouth)
            return new ScreenConfig(constants.BLOCKED, false, false, false);
        if(this.hasNorth && !this.hasWest && !this.hasSouth)
            return new ScreenConfig(`~/images/R${this.isExit(this.isNorthExit)}1.png`, false, false, true);
        if(this.hasNorth && this.hasWest && !this.hasSouth)
            return new ScreenConfig(`~/images/F${this.isExit(this.isWestExit)}R${this.isExit(this.isNorthExit)}1.png`, false, true, true);
        if(this.hasNorth && !this.hasWest && this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isSouthExit)}R${this.isExit(this.isNorthExit)}1.png`, true, false, true);
        if(this.hasNorth && this.hasWest && this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isSouthExit)}F${this.isExit(this.isWestExit)}R${this.isExit(this.isNorthExit)}1.png`, true, true, true);
        if(!this.hasNorth && this.hasWest && this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isSouthExit)}F${this.isExit(this.isWestExit)}1.png`, true, true, false);
        if(!this.hasNorth && !this.hasWest && this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isSouthExit)}1.png`, true, false, false);
        if(!this.hasNorth && this.hasWest && !this.hasSouth)
            return new ScreenConfig(`~/images/F${this.isWestExit?'E':''}1.png`, false, true, false);
    }

    getHeadingSouthScreen(): ScreenConfig{
        if(!this.hasEast && !this.hasWest && !this.hasSouth)
            return new ScreenConfig(constants.BLOCKED, false, false, false);
        if(this.hasEast && !this.hasWest && !this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isEastExit)}1.png`, true, false, false);
        if(this.hasEast && this.hasWest && !this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isEastExit)}R${this.isExit(this.isWestExit)}1.png`, true, false, true);
        if(this.hasEast && !this.hasWest && this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isEastExit)}F${this.isExit(this.isSouthExit)}1.png`, true, true, false);
        if(this.hasEast && this.hasWest && this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isEastExit)}F${this.isExit(this.isSouthExit)}R${this.isExit(this.isWestExit)}1.png`, true, true, true);
        if(!this.hasEast && this.hasWest && this.hasSouth)
            return new ScreenConfig(`~/images/F${this.isExit(this.isSouthExit)}R${this.isExit(this.isWestExit)}1.png`, false, true, true);
        if(!this.hasEast && !this.hasWest && this.hasSouth)
            return new ScreenConfig(`~/images/F${this.isSouthExit?'E':''}1.png`, false, true, false);
        if(!this.hasEast && this.hasWest && !this.hasSouth)
            return new ScreenConfig(`~/images/R${this.isExit(this.isWestExit)}1.png`, false, false, true);
    }

    getHeadingEastScreen(): ScreenConfig{
        if(!this.hasEast && !this.hasNorth && !this.hasSouth)
            return new ScreenConfig(constants.BLOCKED, false, false, false);
        if(this.hasEast && !this.hasNorth && !this.hasSouth)
            return new ScreenConfig(`~/images/F${this.isEastExit?'E':''}1.png`, false, true, false);
        if(this.hasEast && this.hasNorth && !this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isNorthExit)}F${this.isExit(this.isEastExit)}1.png`, true, true, false);
        if(this.hasEast && !this.hasNorth && this.hasSouth)
            return new ScreenConfig(`~/images/F${this.isExit(this.isEastExit)}R${this.isExit(this.isSouthExit)}1.png`, false, true, true);
        if(this.hasEast && this.hasNorth && this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isNorthExit)}F${this.isExit(this.isEastExit)}R${this.isExit(this.isSouthExit)}1.png`, true, true, true);
        if(!this.hasEast && this.hasNorth && this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isNorthExit)}R${this.isExit(this.isSouthExit)}1.png`, true, false, true);
        if(!this.hasEast && !this.hasNorth && this.hasSouth)
            return new ScreenConfig(`~/images/R${this.isExit(this.isSouthExit)}1.png`, false, false, true);
        if(!this.hasEast && this.hasNorth && !this.hasSouth)
            return new ScreenConfig(`~/images/L${this.isExit(this.isNorthExit)}1.png`, true, false, false);
    }
}