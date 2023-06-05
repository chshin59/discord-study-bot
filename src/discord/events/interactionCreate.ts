/**
 * Interaction Create is sent when a user uses an Application Command or Message Component
 *
 * Application Command
 * @see {@link https://discord.com/developers/docs/interactions/application-commands}
 *
 * Message Component
 * @see {@link https://discord.com/developers/docs/interactions/message-components}
 */

import {
  APIInteraction,
  GatewayDispatchEvents,
  InteractionType,
  WithIntrinsicProps,
} from "@discordjs/core";
import { Command } from "discord-study-bot";

const name = GatewayDispatchEvents.InteractionCreate;

const listener: (
  args_0: WithIntrinsicProps<APIInteraction>
) => Promise<void> = async ({ data: interaction, api }) => {
  switch (interaction.type) {
    case InteractionType.Ping:
      break;

    case InteractionType.ApplicationCommand: {
      const commandName = interaction.data.name;
      try {
        const command: Command = await import(`../commands/${commandName}.js`);
        command.execute(interaction, api);
      } catch (error) {
        console.error(`[WARNING] Failed to import command: ${commandName}`);
      }
      break;
    }
    case InteractionType.MessageComponent:
      break;

    case InteractionType.ApplicationCommandAutocomplete:
      break;

    case InteractionType.ModalSubmit:
      break;

    default:
      break;
  }
};

export { name, listener };
