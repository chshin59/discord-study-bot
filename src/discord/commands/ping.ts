import {
  API,
  APIInteraction,
  MessageFlags,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "@discordjs/core";

const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
  name: "핑",
  description: "퐁으로 대답!",
};

async function execute(interaction: APIInteraction, api: API) {
  await api.interactions.reply(interaction.id, interaction.token, {
    content: "퐁!",
    flags: MessageFlags.Ephemeral,
  });
}

export { data, execute };
