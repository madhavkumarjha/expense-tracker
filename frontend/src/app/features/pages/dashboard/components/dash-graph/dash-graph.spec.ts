import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashGraph } from './dash-graph';

describe('DashGraph', () => {
  let component: DashGraph;
  let fixture: ComponentFixture<DashGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashGraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashGraph);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
