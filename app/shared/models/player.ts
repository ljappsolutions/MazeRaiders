import { Coordinate } from "~/shared/models/coordinate";
import * as constants from '~/shared/constants';
import { Bag } from "~/shared/models/bag";
import { IDatabaseObject } from "~/shared/models/database-object";

export class Player implements IDatabaseObject{

    heading: string;
    location: Coordinate;
    bag: Bag[] = [];

    get points(): number{
        return this.bag.map(x => x.value).reduce((accumulator, newValue) => accumulator + newValue, 0);      
    }

    get x(): number{
        return this.location.x;
    }

    get y(): number{
        return this.location.y;
    }

    constructor(rawPlayer: any){
        if(rawPlayer){
            this.heading = rawPlayer.heading;
            this.location = new Coordinate(rawPlayer.x, rawPlayer.y);
            this.bag = rawPlayer ? rawPlayer.bag.map(x => new Bag(x)) : []
        }
    }

    getDatabaseObject(): any{
        return {
            heading: this.heading,
            x: this.x,
            y: this.y,
            bag: this.bag.map(x => x.getDatabaseObject())
        }
    }

    addItem(bag: Bag){
        this.bag.push(bag);
    }

    moveLeft(){
        switch(this.heading){
            case constants.NORTH:
                this.heading = constants.WEST;
                this.location.y--;
                break;
            case constants.WEST:
                this.heading = constants.SOUTH;
                this.location.x--;
                break;
            case constants.SOUTH:
                this.heading = constants.EAST;
                this.location.y++;
                break;
            case constants.EAST:
                this.heading = constants.NORTH;
                this.location.x++;
                break;
        }
    }

    moveFront(){
        switch(this.heading){
            case constants.NORTH:
                this.heading = constants.NORTH;
                this.location.x++;
                break;
            case constants.WEST:
                this.heading = constants.WEST;
                this.location.y--;
                break;
            case constants.SOUTH:
                this.heading = constants.SOUTH;
                this.location.x--;
                break;
            case constants.EAST:
                this.heading = constants.EAST;
                this.location.y++;
                break;
        }
    }

    moveRight(){
        switch(this.heading){
            case constants.NORTH:
                this.heading = constants.EAST;
                this.location.y++;
                break;
            case constants.WEST:
                this.heading = constants.NORTH;
                this.location.x++;
                break;
            case constants.SOUTH:
                this.heading = constants.WEST;
                this.location.y--;
                break;
            case constants.EAST:
                this.heading = constants.SOUTH;
                this.location.x--;
                break;
        }
    }

    moveBack(){
        switch(this.heading){
            case constants.NORTH:
                this.heading = constants.SOUTH;
                this.location.x--;
                break;
            case constants.WEST:
                this.heading = constants.EAST;
                this.location.y++;
                break;
            case constants.SOUTH:
                this.heading = constants.NORTH;
                this.location.x++;
                break;
            case constants.EAST:
                this.heading = constants.WEST;
                this.location.y--;
                break;
        }
    }
}