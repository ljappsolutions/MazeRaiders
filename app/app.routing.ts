import { MazeComponent } from "./maze/maze.component";
import { MenuComponent } from "~/menu/menu.component";
import { OptionsComponent } from "~/options/options.component";
import { ConnectionErrorComponent } from "~/connection-error/connection-error.component";
import { EndGameComponent } from "~/end-game/end-game.component";

export const appRoutes: any = [
    { path: "", component: MenuComponent},
    { path: "maze/:option", component: MazeComponent },
    { path: "options", component: OptionsComponent },
    { path: "connectionError", component: ConnectionErrorComponent },
    { path: "endGame/:score", component: EndGameComponent }
];

export const appComponents: any = [
    MazeComponent,
    MenuComponent,
    OptionsComponent,
    ConnectionErrorComponent,
    EndGameComponent
];