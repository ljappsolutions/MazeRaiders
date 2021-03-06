import { DBNAME, NOTHING } from "~/shared/constants";

let CouchBaseModule = require("nativescript-couchbase");

export interface DbSession{
    currentMaze: string;
    lastAd: number;
    maxPoints: number;
    backgroundMusic: boolean;
    effects: boolean;
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
                lastAd: new Date().getTime(),
                maxPoints: 0,
                backgroundMusic: true,
                effects: true
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

    get maxPoints(): number {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        let maxPoints = this.sessionObj.maxPoints;
        return maxPoints ? maxPoints : 0;
    }

    set maxPoints(value: number) {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        this.sessionObj.maxPoints = value;
        this.database.updateDocument(this.SESSION_DOC_ID, this.sessionObj);
    }

    get backgroundMusic(): boolean {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        let backgroundMusic = this.sessionObj.backgroundMusic;
        return backgroundMusic;
    }

    set backgroundMusic(value: boolean) {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        this.sessionObj.backgroundMusic = value;
        this.database.updateDocument(this.SESSION_DOC_ID, this.sessionObj);
    }

    get effects(): boolean {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        let effects = this.sessionObj.effects;
        return effects;
    }

    set effects(value: boolean) {
        this.sessionObj = this.database.getDocument(this.SESSION_DOC_ID);
        this.sessionObj.effects = value;
        this.database.updateDocument(this.SESSION_DOC_ID, this.sessionObj);
    }
}