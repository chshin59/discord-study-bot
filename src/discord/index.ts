import { REST } from "@discordjs/rest";
import { WebSocketManager } from "@discordjs/ws";
import {
  GatewayDispatchEvents,
  GatewayIntentBits,
  Client,
  API,
} from "@discordjs/core";
import { DISCORD_TOKEN, eventsPath, getFiles } from "../utils";
import { Event } from "discord-study-bot";

export default class Discord {
  private static client: Client;
  private static gateway: WebSocketManager;
  public static api: API;

  public static async init(): Promise<void> {
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
    const api = new API(rest);
    const gateway = new WebSocketManager({
      token: DISCORD_TOKEN,
      intents:
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.MessageContent |
        GatewayIntentBits.GuildVoiceStates,
      rest,
    });
    const client = new Client({ rest, gateway });

    this.api = api;
    this.gateway = gateway;
    this.client = client;
  }

  public static async connect(): Promise<void> {
    const eventFiles = getFiles(eventsPath);
    for (const file of eventFiles) {
      const filePath = `./events/${file}`;
      const event: Event = await import(filePath);

      if (!("name" in event) || !("listener" in event)) {
        console.error(
          `[WARNING] The command at ${filePath} is missing a required "name" or "listener" property.`
        );
        continue;
      }

      event.name === GatewayDispatchEvents.Ready
        ? this.client.once(event.name, event.listener)
        : this.client.on(event.name, event.listener);
    }
    await this.gateway.connect();
  }
}
