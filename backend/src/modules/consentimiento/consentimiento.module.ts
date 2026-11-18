import { Module } from '@nestjs/common';
import { ConsentimientoService } from './consentimiento.service';
import { ConsentimientoController } from './consentimiento.controller';
import { SupervisionModule } from '../supervision/supervision.module';

@Module({
  imports: [SupervisionModule],
  controllers: [ConsentimientoController],
  providers: [ConsentimientoService],
  exports: [ConsentimientoService],
})
export class ConsentimientoModule {}
