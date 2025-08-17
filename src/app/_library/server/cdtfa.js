import { Mutex } from "async-mutex";
import { createClient } from "@/src/app/_library/supabase/server";
import {
  newCacheObject,
  isCacheItemExpired,
  getRedis,
} from "@/src/app/_library/server/redis";

const mutex = new Mutex();
const CALIFORNIA_ZIPCODES = "CALIFORNIA_ZIPCODES";
const CALIFORNIA_ZIPCODES_EXPIRES_IN = "CALIFORNIA_ZIPCODES_EXPIRES_IN";
const CALIFORNIA_ZIPCODES_ISSUED_AT = "CALIFORNIA_ZIPCODES_ISSUED_AT";
const redis = await getRedis();

async function populateCaliforniaZips() {
  const cacheObj = await newCacheObject(
    CALIFORNIA_ZIPCODES,
    CALIFORNIA_ZIPCODES_ISSUED_AT,
    CALIFORNIA_ZIPCODES_EXPIRES_IN
  );
  let tokenExpired = await isCacheItemExpired(cacheObj);
  if (!tokenExpired) {
    return;
  }
  const release = await mutex.acquire();
  // double check expiration once again in case other ops were waiting
  // to acquire the lock.
  tokenExpired = await isCacheItemExpired(cacheObj);
  if (!tokenExpired) {
    console.log(
      "populateCaliforniaZips: After mutex.acquire(), but token isn't expired."
    );
    release();
    return;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("california_zip_codes")
      .select("code")
      .order("code", { ascending: true });
    if (error) throw error;
    const sData = JSON.stringify(data);
    const [item, expires, issued] = await Promise.all([
      redis.set(CALIFORNIA_ZIPCODES, sData),
      redis.set(CALIFORNIA_ZIPCODES_EXPIRES_IN, 60 * 60 * 24 * 7), // a week in seconds
      redis.set(CALIFORNIA_ZIPCODES_ISSUED_AT, Date.now()),
    ]);
    console.log(
      `set item: ${item}\n
       set expires_in: ${expires}\n
       set issued_at: ${issued}`
    );
  } catch (error) {
    console.log(error);
  } finally {
    release();
  }
}

async function serverIsCaliforniaZip(postalCode) {
  await populateCaliforniaZips();
  const caliZips = await redis.get(CALIFORNIA_ZIPCODES);
  const aCaliZips = Array.isArray(caliZips) ? caliZips : JSON.parse(caliZips);
  // Note: postalCode should be first 5 zip characters
  return aCaliZips.find((zip) => postalCode === zip);
}

export { serverIsCaliforniaZip };
