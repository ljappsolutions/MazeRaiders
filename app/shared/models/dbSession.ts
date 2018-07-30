import { Coordinate } from "~/shared/models/coordinate";
import { Maze } from "~/shared/models/maze";
import { DBNAME, NOTHING } from "~/shared/constants";
import { DatePipe } from "../../../node_modules/@angular/common";

let CouchBaseModule = require("nativescript-couchbase");

export interface DbSession{
    currentMaze: string;
    lastAd: number;
}

export class DatabaseSession{
    private static instance: DatabaseSession;
    public static getInstance(): DatabaseSession{
        if(!this.instance){
            this.instance = new DatabaseSession();
        }
        return this.instance;
    }

    constructor() {
        this.database = new CouchBaseModule.Couchbase(this.DATABASE_NAME);
        this.sessionDocument = this.database.getDocument(this.SESSION_DOC_ID);
        if (!this.sessionDocument) {
            this.sessionObj = {
                currentMaze: NOTHING,
                lastAd: new Date().getTime()
            };
            this.database.createDocument(this.sessionObj, this.SESSION_DOC_ID);
            this.sessionDocument = this.database.getDocument(this.SESSION_DOC_ID);
        }
    }

    private DATABASE_NAME = DBNAME;
    private SESSION_DOC_ID = 'session';
    private database;
    private sessionDocument: DbSession;
    private sessionObj: DbSession;

    get currentMaze(): any {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        let mazes = this.sessionObj.currentMaze;
        return mazes !== NOTHING ? JSON.parse(mazes) : null;
    }

    set currentMaze(value: any) {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        this.sessionObj.currentMaze = value ? JSON.stringify(value) : NOTHING;
        this.database.updateDocument(this.SESSION_DOC_ID, this.sessionObj);
    }

    get lastAd(): any {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        let lastAd = this.sessionObj.lastAd;
        if(!lastAd){
            this.sessionObj.lastAd = new Date().getTime();
            this.database.updateDocument(this.SESSION_DOC_ID, this.sessionObj);    
        }
        return lastAd;
    }

    set lastAd(value: any) {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        this.sessionObj.lastAd = value;
        this.database.updateDocument(this.SESSION_DOC_ID, this.sessionObj);
    }
}