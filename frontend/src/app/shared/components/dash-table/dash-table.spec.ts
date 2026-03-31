import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashTable } from './dash-table';

describe('DashTable', () => {
  let component: DashTable;
  let fixture: ComponentFixture<DashTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
