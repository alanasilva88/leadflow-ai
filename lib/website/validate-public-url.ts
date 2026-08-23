import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const allowedPorts = new Set(["", "80", "443"]);

function blockedIp(ip: string) {
  const normalized = ip.toLowerCase();
  if (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fe80:") ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd")
  )
    return true;
  if (normalized.startsWith("::ffff:")) return blockedIp(normalized.slice(7));
  if (isIP(normalized) === 4) {
    const [a, b] = normalized.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  return false;
}

type Resolver = (
  host: string,
) => Promise<{ address: string; family: number }[]>;
const dnsResolver: Resolver = (host) =>
  lookup(host, { all: true, verbatim: true });

export async function validatePublicUrl(
  value: string,
  resolve: Resolver = dnsResolver,
): Promise<URL> {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("URL do site inválida.");
  }
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Protocolo do site não permitido.");
  if (!url.hostname || url.username || url.password)
    throw new Error("URL do site não permitida.");
  if (!allowedPorts.has(url.port))
    throw new Error("Porta do site não permitida.");
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "metadata.google.internal"
  )
    throw new Error("Endereço de rede interna não permitido.");
  if (isIP(host) && blockedIp(host))
    throw new Error("Endereço IP privado ou reservado não permitido.");
  let addresses: { address: string; family: number }[];
  try {
    addresses = await resolve(host);
  } catch {
    throw new Error("Não foi possível resolver o endereço do site.");
  }
  if (!addresses.length || addresses.some(({ address }) => blockedIp(address)))
    throw new Error("O site aponta para uma rede privada ou reservada.");
  return url;
}
