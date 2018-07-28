import * as constants from '../constants';

import { Couchbase } from "nativescript-couchbase";

export interface DbMaze{
    id: string;
    type: string;
    maze: any;
}

export interface MazeCollection{
    mazes: DbMaze[];
    lastCheck: number;
}

export class DatabaseMazes{
    private static instance: DatabaseMazes;
    public static getInstance(): DatabaseMazes{
        if(!this.instance){
            this.instance = new DatabaseMazes();
        }
        return this.instance;
    }

    constructor() {
        this.database = new Couchbase(this.DATABASE_NAME);
        this.mazesDocument = this.database.getDocument(this.MAZES_DOC_ID);
        if (!this.mazesDocument) {
            this.mazesObj = {
                mazes: [],
                lastCheck: 0
            };
            this.database.createDocument(this.mazesObj, this.MAZES_DOC_ID);
            this.mazesDocument = this.database.getDocument(this.MAZES_DOC_ID);
        }
    }

    private DATABASE_NAME = constants.DBNAME;
    private MAZES_DOC_ID = 'mazes';
    private database;
    private mazesDocument: MazeCollection;
    private mazesObj: MazeCollection;

    get mazes(): DbMaze[] {
        this.mazesObj = this.database.getDocument(this.MAZES_DOC_ID);
        let mazes = this.mazesObj.mazes;
        return mazes;
    }

    get lastCheck(): number{
        this.mazesObj = this.database.getDocument(this.MAZES_DOC_ID);
        return this.mazesObj.lastCheck;
    }

    set mazes(value: DbMaze[]) {
        this.mazesObj = this.database.getDocument(this.MAZES_DOC_ID);
        this.mazesObj.mazes = value;
        this.mazesObj.lastCheck = new Date().getTime();
        this.database.updateDocument(this.MAZES_DOC_ID, this.mazesObj);
    }
}