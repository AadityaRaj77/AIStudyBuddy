import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL)

export async function getCache(key) {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
}

export async function setCache(key, value) {
    await redis.set(key, JSON.stringify(value), "EX", 3600)
}