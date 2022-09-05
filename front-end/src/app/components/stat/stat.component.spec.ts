import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StatComponent } from './stat.component';

describe('StatComponent', () => {
  let component: StatComponent;
  let fixture: ComponentFixture<StatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatComponent ],
      imports: [ BrowserAnimationsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
