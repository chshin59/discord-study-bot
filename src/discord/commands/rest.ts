import {
  API,
  APIInteraction,
  MessageFlags,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "@discordjs/core";
import Study from "../../study/index.js";

const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
  name: "rest",
  description: "휴식 toggle",
};

async function execute(interaction: APIInteraction, api: API) {
  if (!interaction.member) return;

  let msg = "";
  const res = Study.rest(interaction.member.user.id);
  if (res === undefined) {
    msg = "모각코 중이 아닙니다.";
  } else if (res) {
    msg = "휴식을 시작합니다.";
  } else {
    msg = "휴식을 종료합니다.";
  }

  await api.interactions.reply(interaction.id, interaction.token, {
    content: msg,
    flags: MessageFlags.Ephemeral,
  });
}

export { data, execute };
