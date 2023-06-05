import {
  API,
  APIInteraction,
  MessageFlags,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "@discordjs/core";

const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
  name: "ping",
  description: "Replies with Pong!",
};

async function execute(interaction: APIInteraction, api: API) {
  await api.interactions.reply(interaction.id, interaction.token, {
    content: "Pong!",
    flags: MessageFlags.Ephemeral,
  });
}

export { data, execute };
