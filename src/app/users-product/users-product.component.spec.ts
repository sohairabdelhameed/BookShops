import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProductComponent } from './users-product.component';

describe('UsersProductComponent', () => {
  let component: UsersProductComponent;
  let fixture: ComponentFixture<UsersProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
