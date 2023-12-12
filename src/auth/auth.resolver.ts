import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  AdminSignInEntity,
  SignInEntity,
  VerifyEmailEntity,
} from './auth.dto';
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
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AdminSignInEntity)
  adminSignIn(@Args('adminSignInInput') adminSignInInput: AdminSignInInput) {
    return this.authService.adminSignIn(adminSignInInput);
  }

  @Mutation(() => String, { name: 'adminRegister' })
  adminRegister(
    @Args('adminRegisterInput') adminRegisterInput: AdminRegisterInput,
  ) {
    return this.authService.adminRegister(adminRegisterInput);
  }

  @Mutation(() => VerifyEmailEntity)
  verifyEmail(@Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput) {
    return this.authService.verifyEmail(verifyEmailInput.token);
  }
}
