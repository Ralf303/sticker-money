import { Context, Scenes } from "telegraf";

export interface CustomSceneSession extends Scenes.SceneSessionData {}

export interface State {
  amount?: number;
}

export interface CustomContext extends Context {
  scene: Scenes.SceneContextScene<CustomContext, CustomSceneSession>;
}
