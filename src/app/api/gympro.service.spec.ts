import { TestBed } from '@angular/core/testing';

import { GymproService } from './gympro.service';

describe('GymproService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GymproService = TestBed.get(GymproService);
    expect(service).toBeTruthy();
  });
});
