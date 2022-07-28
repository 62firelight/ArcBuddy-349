import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';

import { StatSectionComponent } from './stat-section.component';

describe('StatSectionComponent', () => {
  let component: StatSectionComponent;
  let fixture: ComponentFixture<StatSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatSectionComponent ],
      imports: [ MatMenuModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const module = TestBed.inject(MatMenuModule);

    expect(component).toBeTruthy();
  });
});
