export interface JWTClaims {
  readonly userId: number;
  readonly email: string;
}

export type JwtAccessToken = string;
export type SessionId = string;
export type JwtRefreshToken = string;
