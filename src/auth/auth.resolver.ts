import { Resolver, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AdminSignInEntity, SignInEntity, VerifyEmailEntity } from './auth.dto';
import {
  AdminRegisterInput,
  AdminSignInInput,
  RegisterInput,
  SignInInput,
  VerifyEmailInput,
} from './auth.input-types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInEntity)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => String)
  register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context,
  ) {
    const origin = context.req.headers['origin'];
    return this.authService.register(registerInput, origin);
  }

  @Mutation(() => AdminSignInEntity)
  adminSignIn(@Args('adminSignInInput') adminSignInInput: AdminSignInInput) {
    return this.authService.adminSignIn(adminSignInInput);
  }

  @Mutation(() => String, { name: 'adminRegister' })
  adminRegister(
    @Args('adminRegisterInput') adminRegisterInput: AdminRegisterInput,
    @Context() context,
  ) {
    const origin = context.req.headers['origin'];
    return this.authService.adminRegister(adminRegisterInput, origin);
  }

  @Mutation(() => VerifyEmailEntity)
  verifyEmail(@Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput) {
    return this.authService.verifyEmail(verifyEmailInput.token);
  }
}
