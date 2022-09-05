import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    // Arrange
    await TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      declarations: [ SearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // TODO: Refactor search component to be either completely template-driven or reactive, not both
  it('submits no input', () => {
    // const searchButton = debugElement.query(
    //   By.css('[data-testid="search-button"]')
    // );
    // searchButton.triggerEventHandler('click', null);
    // get form element
    const searchForm = debugElement.query(
      By.css('[data-testid="search-form"]')
    );
    // submit form
    searchForm.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    // TODO: Refactor error messages so that they are not hardcoded
    expect(component.error)
      .toBe('Error occurred when parsing Bungie Name. A Bungie Name should formatted similarly to "name#1234".');
  });
});
