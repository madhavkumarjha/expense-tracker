import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCard } from './dash-card';

describe('DashCard', () => {
  let component: DashCard;
  let fixture: ComponentFixture<DashCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
