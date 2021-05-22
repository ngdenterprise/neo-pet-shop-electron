import * as neonCore from "@cityofzion/neon-core";

const REFRESH_INTERVAL = 5000;

export default class BlockchainMonitor {
  private lastKnownBlockHeight = 0;

  constructor(
    private readonly rpcClient: neonCore.rpc.RPCClient,
    private readonly onNewBlock: () => Promise<void>
  ) {
    this.refreshLoop();
  }

  private async refreshLoop() {
    try {
      const blockHeight = await this.rpcClient.getBlockCount();
      if (blockHeight > this.lastKnownBlockHeight) {
        this.lastKnownBlockHeight = blockHeight;
        await this.onNewBlock();
      }
    } finally {
      setTimeout(() => this.refreshLoop(), REFRESH_INTERVAL);
    }
  }
}
