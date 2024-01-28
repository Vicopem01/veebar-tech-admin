import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DevicesService } from './devices.service';
import { AddNewDeviceInput } from './devices.input-types';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

@Resolver()
export class DevicesResolver {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  addNewDevice(
    @Args('addNewDeviceInput') addNewDeviceInput: AddNewDeviceInput,
  ) {
    return this.devicesService.addNewDevice(addNewDeviceInput);
  }
}
