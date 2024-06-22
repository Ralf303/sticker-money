import { Context, Scenes } from "telegraf";

export interface CustomSceneSession extends Scenes.SceneSessionData {
  lastMessageId: number | undefined;
}

export interface CustomContext extends Context {
  lastMessageId: number | undefined;
  scene: Scenes.SceneContextScene<CustomContext, CustomSceneSession>;
}
