import express from "express";
import { isProduction } from "@config/index";
import { AuthServiceInterface } from "@modules/users/services/authService";
import rateLimit from "express-rate-limit";
import { DecodedExpressRequest } from "@modules/users/infra/http/models/decodedRequest";
import { JWTClaims } from "@modules/users/domain/jwt";

export class Middleware {
  private authService: AuthServiceInterface;

  constructor(authService: AuthServiceInterface) {
    this.authService = authService;
  }

  private endRequest(
    status: 400 | 401 | 403,
    message: string,
    res: express.Response
  ): express.Response {
    return res.status(status).send({ message });
  }

  public includeDecodedTokenIfExists(type: "refreshJwt" | "accessJwt") {
    return async (
      req: DecodedExpressRequest,
      res: express.Response,
      next: express.NextFunction
    ): Promise<express.Response | void> => {
      const token: string | undefined = req.headers["authorization"];
      // Confirm that the token was signed with our signature.
      if (!token) {
        return next();
      }

      const decoded: JWTClaims = await (type === "accessJwt"
        ? this.authService.decodeJwtAccessToken(token)
        : this.authService.decodeJwtRefreshToken(token));

      // if signature failed
      if (!decoded) {
        return this.endRequest(403, "Token signature expired.", res);
      }

      // See if the token was found
      const tokens = await this.authService.getTokens(decoded.email);

      // if the token was found, just continue the request.
      if (tokens.length) {
        req.decoded = decoded;
      }

      return next();
    };
  }

  public ensureAuthenticated() {
    return async (
      req: DecodedExpressRequest,
      res: express.Response,
      next: express.NextFunction
    ): Promise<void | express.Response> => {
      const token: string | undefined = req.headers["authorization"];
      // Confirm that the token was signed with our signature.
      if (!token) {
        return this.endRequest(403, "No access token provided", res);
      }
      const decoded: JWTClaims = await this.authService.decodeJwtAccessToken(
        token
      );

      // if signature failed
      if (!decoded) {
        return this.endRequest(403, "Token signature expired.", res);
      }

      // See if the token was found
      const tokens: string[] = await this.authService.getTokens(decoded.email);

      // if the token was found, just continue the request.
      if (tokens.length) {
        req.decoded = decoded;
        return next();
      }
      return this.endRequest(
        403,
        "Auth token not found. User is probably not logged in. Please login again.",
        res
      );
    };
  }

  public static createRateLimit(mins: number, maxRequests: number) {
    return rateLimit({
      windowMs: mins * 60 * 1000,
      max: maxRequests,
    });
  }

  public static restrictedUrl(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void | express.Response {
    if (!isProduction) {
      return next();
    }

    const approvedDomainList = ["https://khalilstemmler.com"];
    const domain: string | string[] = req.headers.origin;
    const isValidDomain = !!approvedDomainList.find(
      (approvedDomain: string) => approvedDomain === domain
    );
    console.log(`Domain =${domain}, valid?=${isValidDomain}`);

    if (!isValidDomain) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return next();
  }
}
