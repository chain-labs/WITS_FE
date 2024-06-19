import { skaleNebulaTestnet } from "viem/chains";

export function isValid32ByteHexString(hexString: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(hexString);
}

export function isValidChainId(chainId: number): boolean {
  const chainIds: number[] = [skaleNebulaTestnet.id];
  return chainIds.includes(chainId);
}

export const saveToLocalStorage = (key: string, value: string[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const clearLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
