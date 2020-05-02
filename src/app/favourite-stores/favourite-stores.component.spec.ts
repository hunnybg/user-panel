import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteStoresComponent } from './favourite-stores.component';

describe('FavouriteStoresComponent', () => {
  let component: FavouriteStoresComponent;
  let fixture: ComponentFixture<FavouriteStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
