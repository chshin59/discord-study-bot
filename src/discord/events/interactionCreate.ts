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
import Discord from "..";

const name = GatewayDispatchEvents.InteractionCreate;

const listener: (
  args_0: WithIntrinsicProps<APIInteraction>
) => Promise<void> = async ({ data: interaction, api }) => {
  switch (interaction.type) {
    case InteractionType.Ping:
      break;

    case InteractionType.ApplicationCommand: {
      const commandName = interaction.data.name;
      const command = Discord.commands.get(commandName);
      if (!command) {
        console.error(`[WARNING] Failed to find command: ${commandName}`);
        break;
      }
      command.execute(interaction, api);
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
