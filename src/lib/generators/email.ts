import type { Rng } from "./rng";

// RFC 2606 reserved domains — emails can never reach a real inbox.
const DOMAINS = ["example.com", "example.net", "example.org"] as const;

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function generateEmail(rng: Rng, firstName: string, lastName: string): string {
  const first = slug(firstName);
  const last = slug(lastName);
  const local = rng.pick([
    `${first}.${last}`,
    `${first}${last}`,
    `${first[0] ?? ""}${last}`,
    `${first}.${last}${rng.int(1, 99)}`,
    `${first}_${last}`,
  ]);
  return `${local}@${rng.pick(DOMAINS)}`;
}
