import { REST } from "@discordjs/rest";
import { WebSocketManager } from "@discordjs/ws";
import {
  GatewayDispatchEvents,
  GatewayIntentBits,
  Client,
  API,
} from "@discordjs/core";
import { DISCORD_TOKEN, commandsPath, eventsPath, getFiles } from "../utils";
import { Command, Event } from "discord-study-bot";

export default class Discord {
  private static client: Client;
  private static gateway: WebSocketManager;
  public static api: API;
  public static commands: Map<string, Command>;

  public static async init(): Promise<void> {
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
    const gateway = new WebSocketManager({
      token: DISCORD_TOKEN,
      intents:
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.MessageContent |
        GatewayIntentBits.GuildVoiceStates,
      rest,
    });
    const client = new Client({ rest, gateway });
    const api = new API(rest);

    this.client = client;
    this.gateway = gateway;
    this.api = api;
  }

  public static async connect(): Promise<void> {
    await this.registerCommands();
    await this.registerEvents();
    await this.gateway.connect();
  }

  private static async registerCommands(): Promise<void> {
    const commands = new Map<string, Command>();
    const commandFiles = getFiles(commandsPath);
    for (const file of commandFiles) {
      const filePath = `./commands/${file}`;
      const command: Command = await import(filePath);

      if (!("data" in command) || !("execute" in command)) {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
        continue;
      }
      commands.set(command.data.name, command);
    }

    this.commands = commands;
  }

  private static async registerEvents(): Promise<void> {
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
  }
}
