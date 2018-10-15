import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as constants from '../constants';
import { DatabaseMazes, DbMaze } from '~/shared/models/dbMaze';
import { connectionType, getConnectionType } from 'tns-core-modules/connectivity'
import { addDays } from 'date-fns';

@Injectable()
export class MazeGeneratorService {
    constructor(private httpClient: HttpClient) { }

    private coinsDistribution: number = 1;
    private coinsMin: number = 25;
    private coinsMax: number = 75;

    private jewelsDistribution: number = 0.3;
    private jewelsMin: number = 105;
    private jewelsMax: number = 630;

    private ingotDistribution: number = 0.1;
    private ingotMin: number = 805;
    private ingotMax: number = 1410;

    private bagDistribution: number = 0.5;
    private databaseMazes = DatabaseMazes.getInstance();

    getMaze(): Promise<any>{
        if(this.databaseMazes.mazes && this.databaseMazes.mazes.length > 0
            && this.databaseMazes.lastCheck > addDays(new Date(), -7).getTime()){
            return new Promise((resolve, reject) => {
                let maze = this.databaseMazes.mazes[
                    Math.floor(Math.random()
                        *this.databaseMazes.mazes.length)]
                resolve(this.generateItems(maze));
            });
        }else if (getConnectionType() !== connectionType.none){
            return this.httpClient.get(
                'https://u12z8ud954.execute-api.us-east-1.amazonaws.com/prod/maze'
            ).toPromise().then(data => {
                this.databaseMazes.mazes = data as DbMaze[];
                let maze = this.databaseMazes.mazes[Math.floor(Math.random()*this.databaseMazes.mazes.length)]
                return this.generateItems(maze);
            });
        }else{
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }
    }

    private generateItems(data): any {
        var mazeConfig = data as any;
        for(var i = 0; i<mazeConfig.maze.length; i++){
            for(var j = 0; j<mazeConfig.maze[i].length; j++){
                if(Math.random() < this.bagDistribution){
                    let itemProbability = Math.random();
                    let itemType;
                    let value;
                    if(itemProbability < this.ingotDistribution){
                        itemType = constants.INGOT;
                        value = Math.floor((Math.random() * this.ingotMax) + this.ingotMin);
                    }else if(itemProbability < this.jewelsDistribution){
                        itemType = constants.JEWELS;
                        value = Math.floor((Math.random() * this.jewelsMax) + this.jewelsMin);
                    }else if(itemProbability < this.coinsDistribution){
                        itemType = constants.COINS;
                        value = Math.floor((Math.random() * this.coinsMax) + this.coinsMin);
                    }
                    mazeConfig.maze[i][j].bag = {
                        itemType,
                        value
                    };
                }
            }
        }
        return mazeConfig;
    }
}