import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditexerciceComponent } from './editexercice.component';

describe('EditexerciceComponent', () => {
  let component: EditexerciceComponent;
  let fixture: ComponentFixture<EditexerciceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditexerciceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditexerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
