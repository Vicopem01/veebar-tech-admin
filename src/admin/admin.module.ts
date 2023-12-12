import { Module } from '@nestjs/common';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  exports: [MongooseModule],
})
export class AdminModule {}
