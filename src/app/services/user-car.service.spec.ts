import { TestBed } from '@angular/core/testing';

import { UserCarService } from './user-car.service';

describe('UserCarService', () => {
  let service: UserCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
