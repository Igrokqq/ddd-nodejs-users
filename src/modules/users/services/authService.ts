import {
  JwtAccessToken,
  JWTClaims,
  JwtRefreshToken,
} from "@modules/users/domain/jwt";
import User from "@modules/users/domain/user";

export interface AuthServiceInterface {
  signJwtAccessToken(props: JWTClaims): JwtAccessToken;
  signJwtRefreshToken(props: JWTClaims): JwtRefreshToken;
  decodeJwtAccessToken(token: string): Promise<JWTClaims>;
  decodeJwtRefreshToken(token: string): Promise<JWTClaims>;
  getTokens(email: string): Promise<string[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  logoutUserSessions(email: string): Promise<void>;
  refreshTokenExists(refreshToken: JwtRefreshToken): Promise<boolean>;
  getEmailFromRefreshToken(refreshToken: JwtRefreshToken): Promise<string>;
}
