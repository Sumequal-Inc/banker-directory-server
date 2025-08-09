// // src/auth/google.strategy.ts
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import {
//   Strategy,
//   VerifyCallback,
//   StrategyOptionsWithRequest, // optional, for typing the options below
// } from 'passport-google-oauth20';
// import { Request } from 'express';
// import { AuthService } from './auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(private authService: AuthService) {
//     super({
//       clientID: process.env.GOOGLE_CLIENT_ID!,       // add ! if using strictNullChecks
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//       scope: ['profile', 'email'],
//     //   state: true,
//       passReqToCallback: true,                       // ✅ required for WithRequest overload
//     } as StrategyOptionsWithRequest);
//   }

//   async validate(
//     req: Request,                                    // ✅ include req now
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ) {
//     // You can read req.query.state if you need it
//     const user = await this.authService.validateGoogleUser(profile);
//     done(null, user);
//   }
// }
