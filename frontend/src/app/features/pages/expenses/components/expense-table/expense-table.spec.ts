import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTable } from './expense-table';

describe('ExpenseTable', () => {
  let component: ExpenseTable;
  let fixture: ComponentFixture<ExpenseTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
