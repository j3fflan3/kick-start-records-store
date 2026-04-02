import { Mutex } from "async-mutex";
import { createClient } from "@/src/app/library/supabase/server";
import {
  newCacheObject,
  isCacheItemExpired,
  getRedis,
} from "@/src/app/library/server/redis";

const mutex = new Mutex();
const COUNTRIES = "COUNTRIES";
const COUNTRIES_EXPIRES_IN = "COUNTRIES_EXPIRES_IN";
const COUNTRIES_ISSUED_AT = "COUNTRIES_ISSUED_AT";
const redis = await getRedis();

interface Country {
  name: string;
  alpha2: string;
}

async function populateCountries(): Promise<void> {
  const cacheObj = await newCacheObject(
    COUNTRIES,
    COUNTRIES_ISSUED_AT,
    COUNTRIES_EXPIRES_IN
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
      "populateCountries: After mutex.acquire(), but token isn't expired."
    );
    release();
    return;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("country")
      .select("name, alpha2")
      .eq("forbidden", false)
      .order("name", { ascending: true });
    if (error) throw error;
    const sData = JSON.stringify(data);
    console.log(sData);
    const [item, expires, issued] = await Promise.all([
      redis.set(COUNTRIES, sData),
      redis.set(COUNTRIES_EXPIRES_IN, 60 * 60 * 24 * 7), // a week in seconds
      redis.set(COUNTRIES_ISSUED_AT, Date.now()),
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

async function getCountries(): Promise<{ data: Country[] }> {
  await populateCountries();
  const countries = await redis.get<string>(COUNTRIES);
  const data: Country[] = Array.isArray(countries) ? countries : JSON.parse(countries as string);
  return { data };
}

export { getCountries };
