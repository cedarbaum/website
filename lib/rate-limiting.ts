import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const RATE_LIMIT_PREFIX = "cedarbaum.io";

const globalRequestLimit = parseInt(process.env.DAILY_API_LIMIT!);
const globalRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(globalRequestLimit, "24 h"),
  prefix: `${RATE_LIMIT_PREFIX}-global`,
  analytics: false,
});

const perIpPerMinRequestLimit = parseInt(process.env.PER_IP_PER_MIN_LIMIT!);
const ipLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(perIpPerMinRequestLimit, "1 m"),
  prefix: `${RATE_LIMIT_PREFIX}-ip`,
  analytics: false,
});

export default async function apiQuotaAvailable(req: Request) {
  const { success: globalRateOk } = await globalRateLimit.limit(
    "globalRateLimit"
  );

  if (!globalRateOk) {
    return false;
  }

  const detectedIp = getIp(req)
  const { success: perIpOk } = await ipLimit.limit(detectedIp);
  return perIpOk;
}


function getIp(req: Request) {
  const ip = req.headers.get("x-forwarded-for");
  return ip ? ip.split(",")[0].trim() : "unknown";
}
