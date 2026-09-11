import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AccountType } from "../generated/prisma/enums.js";
import config from "../config/config.js";
import { createHash } from "node:crypto";

interface TokenPayload {
  id: string;
  email: string;
  accountType: AccountType;
}

export interface AccessTokenPayload {
  id: string;
  email: string;
  accountType: AccountType;
  iat: number;
  exp: number;
}

interface RefreshTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

interface RefreshTokenResult{
    refreshToken : string
    hashedRefreshToken : string
}


class Guards {
  //hash password
  static hashPassword = (password: string) => {
    return bcrypt.hashSync(password, 10);
  };
  static comparePassword = async (
    password: string,
    hashPassword: string,
  ): Promise<Boolean> => {
    return await bcrypt.compare(password, hashPassword);
  };
  static createAccessToken = (user: TokenPayload): string => {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
      },
      config.access_token_secret_key,
      {
        expiresIn: "15m",
      },
    );
    return token;
  };

  static verifyAccessToken = (token: string): AccessTokenPayload => {
    return jwt.verify(
      token,
      config.access_token_secret_key,
    ) as AccessTokenPayload;
  };

  static createRefreshToken = (user: TokenPayload): RefreshTokenResult => {
    const refreshToken = jwt.sign(
      {
        sub: user.id,
      },
      config.refresh_token_secret_key,
      { expiresIn: "7d" },
    );

    const hashedRefreshToken = createHash("sha256").update(refreshToken).digest("hex")

    return{
        refreshToken,
        hashedRefreshToken
    }
  };

  static verifyRefreshToken = (token:string):RefreshTokenPayload=>{
    return jwt.verify(token,config.refresh_token_secret_key) as RefreshTokenPayload
  }
}

export default Guards;
