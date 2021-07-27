import {
  JwtAccessToken,
  JWTClaims,
  JwtRefreshToken,
} from "@modules/users/domain/jwt";
import User from "@modules/users/domain/user";

export interface AuthServiceInterface {
  signJWT(props: JWTClaims): JwtAccessToken;
  decodeJWT(token: string): Promise<JWTClaims>;
  createRefreshToken(): JwtRefreshToken;
  getTokens(email: string): Promise<string[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(email: string): Promise<void>;
  refreshTokenExists(refreshToken: JwtRefreshToken): Promise<boolean>;
  getEmailFromRefreshToken(refreshToken: JwtRefreshToken): Promise<string>;
}
