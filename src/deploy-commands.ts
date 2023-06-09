import { REST } from "@discordjs/rest";
import {
  API,
  APIApplicationCommand,
  RESTPutAPIApplicationCommandsJSONBody,
} from "@discordjs/core";
import {
  CLIENT_ID,
  commandsPath,
  DISCORD_TOKEN,
  getFiles,
  GUILD_ID,
} from "./utils";
import { Command } from "discord-study-bot";

async function run() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  const api = new API(rest);

  const commands: RESTPutAPIApplicationCommandsJSONBody = [];
  const commandFiles = getFiles(commandsPath);

  for (const file of commandFiles) {
    const command: Command = await import(`./discord/commands/${file}`);
    commands.push(command.data);
  }

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data: APIApplicationCommand[] =
      await api.applicationCommands.bulkOverwriteGuildCommands(
        CLIENT_ID,
        GUILD_ID,
        commands
      );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

run();
