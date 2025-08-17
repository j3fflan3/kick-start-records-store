"use server";
import { isDateExpired } from "@/src/app/_library/utilities";
import { Redis } from "@upstash/redis";
// Used for key/value storage get/set
const redis = Redis.fromEnv();

// Class to represent a redis cache object
class CacheObject {
  constructor(item, issuedAt, expiresIn) {
    this.item = item;
    this.issuedAt = issuedAt;
    this.expiresIn = expiresIn;
  }
}
// Function to determine if a cached redis object is expired or not
async function isCacheItemExpired({ item, issuedAt, expiresIn }) {
  const [_item, _issuedAt, _expiresIn] = await Promise.all([
    redis.get(item),
    redis.get(issuedAt),
    redis.get(expiresIn),
  ]);
  if (_item && _issuedAt && _expiresIn) {
    if (!isDateExpired(_issuedAt, _expiresIn)) {
      console.log(`${item} isn't expired`);
      return false;
    }
  }
  return true;
}
async function getRedis() {
  return redis;
}
async function newCacheObject(item, issuedAt, expiresIn) {
  return new CacheObject(item, issuedAt, expiresIn);
}

export { getRedis, newCacheObject, isCacheItemExpired };
