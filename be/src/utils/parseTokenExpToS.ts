export function parseAccessExpToS(access_exp: string): number {
  if (/^\d+$/.test(access_exp)) {
    return Number(access_exp);
  }

  const match = access_exp.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error("Invalid access_exp format");
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    default:
      throw new Error("Invalid time unit");
  }
}