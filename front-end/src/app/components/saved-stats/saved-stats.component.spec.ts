import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedStatsComponent } from './saved-stats.component';

describe('SavedStatsComponent', () => {
  let component: SavedStatsComponent;
  let fixture: ComponentFixture<SavedStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
