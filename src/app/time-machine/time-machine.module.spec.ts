import { TimeMachineModule } from './time-machine.module';

describe('TimeMachineModule', () => {
  let timeMachineModule: TimeMachineModule;

  beforeEach(() => {
    timeMachineModule = new TimeMachineModule();
  });

  it('should create an instance', () => {
    expect(timeMachineModule).toBeTruthy();
  });
});
