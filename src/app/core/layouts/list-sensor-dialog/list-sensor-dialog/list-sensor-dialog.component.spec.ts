import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSensorDialogComponent } from './list-sensor-dialog.component';

describe('ListSensorDialogComponent', () => {
  let component: ListSensorDialogComponent;
  let fixture: ComponentFixture<ListSensorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSensorDialogComponent]
    });
    fixture = TestBed.createComponent(ListSensorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
