import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

import { SearchComponent } from './search.component';

export function findEl<T>(
  fixture: ComponentFixture<T>,
  testId: string
): DebugElement {
  return fixture.debugElement.query(
    By.css(`[data-testid="${testId}"]`)
  );
}

export function makeClickEvent(
  target: EventTarget
): Partial<MouseEvent> {
  return {
    preventDefault(): void { },
    stopPropagation(): void { },
    stopImmediatePropagation(): void { },
    type: 'click',
    target,
    currentTarget: target,
    bubbles: true,
    cancelable: true,
    button: 0
  };
}

export function click<T>(
  fixture: ComponentFixture<T>,
  testId: string
): void {
  const element = findEl(fixture, testId);
  const event = makeClickEvent(element.nativeElement);
  element.triggerEventHandler('click', event);
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let profileService: ProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    })
      .compileComponents();
    profileService = TestBed.inject(ProfileService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('perform a valid search', () => {
    // const expectedProfile: Profile = {
    //   _id: '123',
    //   displayName: '62firelight',
    //   membershipType: '3',
    //   membershipId: '123',
    //   iconPath: '',

    //   dateCreated: new Date(),

    //   characters: [],
    //   mergedStats: {},
    //   pveStats: {},
    //   pvpStats: {}
    // };

    // const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getName']);
    // const getNameSpy = profileServiceSpy.getName.and.returnValue(expectedProfile);

    // let newProfile: Profile | undefined;
    // component.newProfileEvent.subscribe((profile) => {
    //   newProfile = profile
    // });

    const searchInput = findEl(fixture, 'search-input').nativeElement;
    searchInput.value = '62firelight#8173';
    searchInput.dispatchEvent(new Event('input'));

    expect(searchInput.value).toBe('62firelight#8173');

    click(fixture, 'search-button');
    fixture.detectChanges();

    // expect(newProfile).toBe(expectedProfile);
  });
});
