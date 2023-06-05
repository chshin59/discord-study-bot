import {
  GatewayDispatchEvents,
  GatewayReadyDispatchData,
  WithIntrinsicProps,
} from "@discordjs/core";

const name = GatewayDispatchEvents.Ready;

const listener: (
  args_0: WithIntrinsicProps<GatewayReadyDispatchData>
) => void = () => {
  console.log("Ready!");
};

export { name, listener };
