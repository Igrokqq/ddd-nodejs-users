import { RedisClient } from "redis";
import * as jwt from "jsonwebtoken";
import randtoken from "rand-token";
import { authConfig } from "@config/index";
import { AbstractRedisClient } from "./abstractRedisClient";
import { AuthServiceInterface } from "@modules/users/services/authService";
import {
  JwtRefreshToken,
  JwtAccessToken,
  JWTClaims,
} from "@modules/users/domain/jwt";
import User from "@modules/users/domain/user";

/**
 * @class JWTClient
 * @extends AbstractRedisClient
 * @desc This class is responsible for persisting jwts to redis
 * and for signing tokens. It should also be responsible for determining their
 * validity.
 */

export default class RedisAuthService
  extends AbstractRedisClient
  implements AuthServiceInterface
{
  public jwtHashName = "activeJwtClients";

  constructor(redisClient: RedisClient) {
    super(redisClient);
  }

  public async refreshTokenExists(
    refreshToken: JwtRefreshToken
  ): Promise<boolean> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  public async getEmailFromRefreshToken(
    refreshToken: JwtRefreshToken
  ): Promise<string> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) throw new Error("Email not found for refresh token.");

    const key = keys[0];

    return key.substring(
      key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1
    );
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(
        user.email.value,
        user.refreshToken,
        user.accessToken
      );
    }
  }

  public async deAuthenticateUser(email: string): Promise<void> {
    await this.clearAllSessions(email);
  }

  public createRefreshToken(): JwtRefreshToken {
    return randtoken.uid(256) as JwtRefreshToken;
  }

  /**
   * @function signJWT
   * @desc Signs the JWT token using the server secret with some claims
   * about the current user.
   */

  public signJWT(props: JWTClaims): JwtAccessToken {
    const claims: JWTClaims = {
      email: props.email,
      userId: props.userId,
    };

    return jwt.sign(claims, authConfig.secret, {
      expiresIn: authConfig.tokenExpiryTime,
    });
  }

  /**
   * @method decodeJWT
   * @desc Decodes the JWT using the server secret. If successful decode,
   * it returns the data from the token.
   * @param {token} string
   * @return Promise<any>
   */

  public decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return resolve(null);
        return resolve(decoded);
      });
    });
  }

  private constructKey(email: string, refreshToken: JwtRefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${email}`;
  }

  /**
   * @method addToken
   * @desc Adds the token for this user to redis.
   *
   * @param {email} string
   * @param {refreshToken} string
   * @param {token} string
   * @return Promise<any>
   */

  public addToken(
    email: string,
    refreshToken: JwtRefreshToken,
    token: JwtAccessToken
  ): Promise<any> {
    return this.set(this.constructKey(email, refreshToken), token);
  }

  /**
   * @method clearAllTokens
   * @desc Clears all jwt tokens from redis. Usually useful for testing.
   * @return Promise<any>
   */

  public async clearAllTokens(): Promise<any> {
    const allKeys = await this.getAllKeys(`*${this.jwtHashName}*`);
    return Promise.all(allKeys.map((key) => this.deleteOne(key)));
  }

  /**
   * @method countSessions
   * @desc Counts the total number of sessions for a particular user.
   * @param {email} string
   * @return Promise<number>
   */

  public countSessions(email: string): Promise<number> {
    return this.count(`*${this.jwtHashName}.${email}`);
  }

  /**
   * @method countTokens
   * @desc Counts the total number of sessions for a particular user.
   * @return Promise<number>
   */

  public countTokens(): Promise<number> {
    return this.count(`*${this.jwtHashName}*`);
  }

  /**
   * @method getTokens
   * @desc Gets the user's tokens that are currently active.
   * @return Promise<string[]>
   */

  public async getTokens(email: string): Promise<string[]> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${email}`
    );
    return keyValues.map((kv) => kv.value);
  }

  /**
   * @method getToken
   * @desc Gets a single token for the user.
   * @param {email} string
   * @param {refreshToken} string
   * @return Promise<string>
   */

  public async getToken(email: string, refreshToken: string): Promise<string> {
    return this.getOne(this.constructKey(email, refreshToken));
  }

  /**
   * @method clearToken
   * @desc Deletes a single user's session token.
   * @param {email} string
   * @param {refreshToken} string
   * @return Promise<string>
   */

  public async clearToken(email: string, refreshToken: string): Promise<any> {
    return this.deleteOne(this.constructKey(email, refreshToken));
  }

  /**
   * @method clearAllSessions
   * @desc Clears all active sessions for the current user.
   * @param {email} string
   * @return Promise<any>
   */

  public async clearAllSessions(email: string): Promise<any> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${email}`
    );
    const keys = keyValues.map((kv) => kv.key);
    return Promise.all(keys.map((key) => this.deleteOne(key)));
  }

  /**
   * @method sessionExists
   * @desc Checks if the session for this user exists
   * @param {email} string
   * @param {refreshToken} string
   * @return Promise<boolean>
   */

  public async sessionExists(
    email: string,
    refreshToken: string
  ): Promise<boolean> {
    const token = await this.getToken(email, refreshToken);
    if (token) {
      return true;
    } else {
      return false;
    }
  }
}
