import { TestBed } from '@angular/core/testing';

import { PlanbuilderService } from './planbuilder.service';

describe('PlanbuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanbuilderService = TestBed.get(PlanbuilderService);
    expect(service).toBeTruthy();
  });
});
