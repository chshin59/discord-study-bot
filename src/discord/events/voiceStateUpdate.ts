import Study from "../../study";
import User from "../../user";
import { botChannelId, loungeChannelId } from "../../utils";
import {
  GatewayDispatchEvents,
  GatewayVoiceState,
  WithIntrinsicProps,
} from "@discordjs/core";

const sessionMap: Map<string, GatewayVoiceState> = new Map();

function getVoiceState(discordId: string) {
  return sessionMap.get(discordId);
}

function setVoiceState(discordId: string, voiceState: GatewayVoiceState) {
  sessionMap.set(discordId, voiceState);
}

const name = GatewayDispatchEvents.VoiceStateUpdate;

const listener: (
  args_0: WithIntrinsicProps<GatewayVoiceState>
) => Promise<void> = async ({ data: voiceState, api }) => {
  const discordId = voiceState.user_id;
  const oldVoiceState = getVoiceState(discordId);

  // Voice 채널 입장
  if (isStudyChannelJoin(oldVoiceState, voiceState)) {
    api.channels.createMessage(botChannelId, {
      content: `@everyone ${User.getName(voiceState.user_id)} 님이 입장`,
    });
    Study.start(discordId);
  }
  // Voice 채널 퇴장
  else if (isStudyChannelLeave(oldVoiceState, voiceState)) {
    Study.end(discordId);
  }

  // voiceState 업데이트
  setVoiceState(discordId, voiceState);
};

function isStudyChannelJoin(
  oldVoiceState: GatewayVoiceState | undefined,
  voiceState: GatewayVoiceState
) {
  return (
    (!oldVoiceState ||
      oldVoiceState.channel_id === null ||
      oldVoiceState.channel_id === loungeChannelId) &&
    voiceState.channel_id !== null &&
    voiceState.channel_id !== loungeChannelId
  );
}

function isStudyChannelLeave(
  oldVoiceState: GatewayVoiceState | undefined,
  voiceState: GatewayVoiceState
) {
  return (
    oldVoiceState &&
    oldVoiceState.channel_id !== null &&
    oldVoiceState.channel_id !== loungeChannelId &&
    (voiceState.channel_id === null ||
      voiceState.channel_id === loungeChannelId)
  );
}

export { name, listener };
