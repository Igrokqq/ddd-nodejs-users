import { JwtAccessToken, JwtRefreshToken } from "@modules/users/domain/jwt";

export interface LoginRequestDto {
  readonly email: string;
}
export interface LoginResponseDto {
  readonly accessToken: JwtAccessToken;
  readonly refreshToken: JwtRefreshToken;
}
