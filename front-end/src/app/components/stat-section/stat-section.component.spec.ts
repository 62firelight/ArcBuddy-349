import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatSectionComponent } from './stat-section.component';

describe('StatSectionComponent', () => {
  let component: StatSectionComponent;
  let fixture: ComponentFixture<StatSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
