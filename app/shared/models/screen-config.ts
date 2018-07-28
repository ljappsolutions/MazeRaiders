import { Bag } from "~/shared/models/bag";

export class ScreenConfig{
    constructor(private image: string, left: boolean, front: boolean, right: boolean, isExit: boolean = false){
        this.backgroundImage = image;
        this.hasLeftArrow = left;
        this.hasFrontArrow = front;
        this.hasRightArrow = right;
        this.isExit = isExit;
    }

    backgroundImage: string;
    hasLeftArrow: boolean;
    hasFrontArrow: boolean;
    hasRightArrow: boolean;
    isExit: boolean;
    bag: Bag;
}