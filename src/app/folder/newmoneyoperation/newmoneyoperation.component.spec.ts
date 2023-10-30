import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewmoneyoperationComponent } from './newmoneyoperation.component';

describe('NewmoneyoperationComponent', () => {
  let component: NewmoneyoperationComponent;
  let fixture: ComponentFixture<NewmoneyoperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewmoneyoperationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewmoneyoperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
