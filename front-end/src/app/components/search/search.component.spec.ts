import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

  it('submits no input', () => {
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

  // it('submits invalid input', fakeAsync(async () => {
  //   // Act
  //   const result = 1 + 1;

  //   const searchInput = debugElement.query(
  //     By.css('[data-testid="search-input"]')
  //   );
  //   const searchInputEl = searchInput.nativeElement;
  //   // set invalid field value
  //   searchInputEl.value = 'Guardian#1234';
  //   // dispatch input event
  //   const event = document.createEvent('Event');
  //   event.initEvent('input', true, false);
  //   fixture.detectChanges();
  //   // searchInput.triggerEventHandler('input');
  //   // dispatchEvent(new Event('input'));
  //   searchInputEl.dispatchEvent(new Event('input'));

  //   tick(1000);

  //   fixture.detectChanges();
  //   // get form element
  //   const searchForm = debugElement.query(
  //     By.css('[data-testid="search-form"]')
  //   );
  //   // submit form
  //   searchForm.triggerEventHandler('ngSubmit', null);
  //   fixture.detectChanges();
    
  //   console.log(searchInputEl.value, component.name, component.error);

  //   // Assert
  //   expect(result).toBe(2);
  // }));
});
