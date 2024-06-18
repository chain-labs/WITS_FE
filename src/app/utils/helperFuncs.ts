import { skaleNebulaTestnet } from "viem/chains";

export function isValid32ByteHexString(hexString: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(hexString);
}

export function isValidChainId(chainId: number): boolean {
  const chainIds: number[] = [skaleNebulaTestnet.id];
  return chainIds.includes(chainId);
}
