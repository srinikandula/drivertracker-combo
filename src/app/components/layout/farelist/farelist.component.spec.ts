import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarelistComponent } from './farelist.component';

describe('FarelistComponent', () => {
  let component: FarelistComponent;
  let fixture: ComponentFixture<FarelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FarelistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FarelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
