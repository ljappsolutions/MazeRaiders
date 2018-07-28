import * as constants from '../constants';
import { IDatabaseObject } from '~/shared/models/database-object';

export class Bag implements IDatabaseObject{
    itemType: string;
    value: number;

    constructor(private rawBag){
        if(rawBag){
            this.itemType = rawBag.itemType;
            this.value = rawBag.value;
        }
    }

    getDatabaseObject(): any {
        return {
            itemType: this.itemType,
            value: this.value
        }
    }

    getItemImage(): string{
        switch(this.itemType){
            case constants.INGOT:
                return "~/images/ingots.png";
            case constants.JEWELS:
                return "~/images/jewels.png";
            case constants.COINS:
                return "~/images/coins.png";
        }
        return "";
    }
}