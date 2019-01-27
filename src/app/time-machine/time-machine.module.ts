import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeMachineComponent } from './time-machine/time-machine.component';
import { TimeMachineContentDirective } from './time-machine-content.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TimeMachineComponent,
    TimeMachineContentDirective
  ],
  exports: [
    TimeMachineComponent,
    TimeMachineContentDirective
  ]
})
export class TimeMachineModule { }
