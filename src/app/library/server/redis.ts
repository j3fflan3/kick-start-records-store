"use server";
import { isDateExpired } from "@/src/app/library/utilities";
import { Redis } from "@upstash/redis";

// Used for key/value storage get/set
const redis = Redis.fromEnv();

interface CacheObjectParams {
  item: string;
  issuedAt: string;
  expiresIn: string;
}

// Class to represent a redis cache object
class CacheObject implements CacheObjectParams {
  item: string;
  issuedAt: string;
  expiresIn: string;

  constructor(item: string, issuedAt: string, expiresIn: string) {
    this.item = item;
    this.issuedAt = issuedAt;
    this.expiresIn = expiresIn;
  }
}

// Function to determine if a cached redis object is expired or not
async function isCacheItemExpired({ item, issuedAt, expiresIn }: CacheObjectParams): Promise<boolean> {
  const [_item, _issuedAt, _expiresIn] = await Promise.all([
    redis.get(item),
    redis.get<number>(issuedAt),
    redis.get<number>(expiresIn),
  ]);
  if (_item && _issuedAt && _expiresIn) {
    if (!isDateExpired(_issuedAt, _expiresIn)) {
      console.log(`${item} isn't expired`);
      return false;
    }
  }
  return true;
}

async function getRedis(): Promise<Redis> {
  return redis;
}

async function newCacheObject(item: string, issuedAt: string, expiresIn: string): Promise<CacheObject> {
  return new CacheObject(item, issuedAt, expiresIn);
}

export { getRedis, newCacheObject, isCacheItemExpired };
