const authConfig = {
  jwtAccessTokenSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessTokenExpirationTime: 300, // seconds => 5 minutes
  jwtRefreshTokenExpirationTime: 300, // seconds => 5 minutes
  redisServerPort: process.env.REDIS_PORT || 6379,
  redisServerURL: process.env.REDIS_URL,
  redisConnectionString: process.env.REDIS_URL || "",
};

export { authConfig };
