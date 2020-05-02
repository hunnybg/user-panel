import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCommonComponent } from './profile-common.component';

describe('ProfileCommonComponent', () => {
  let component: ProfileCommonComponent;
  let fixture: ComponentFixture<ProfileCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
