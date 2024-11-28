import { TestBed } from '@angular/core/testing';

import { FireViajeService } from './fire-viaje.service';

describe('FireViajeService', () => {
  let service: FireViajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireViajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
