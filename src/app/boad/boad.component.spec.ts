import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoadComponent } from './boad.component';

describe('BoadComponent', () => {
  let component: BoadComponent;
  let fixture: ComponentFixture<BoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
