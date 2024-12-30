import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioCamPage } from './radio-cam.page';

describe('RadioCamPage', () => {
  let component: RadioCamPage;
  let fixture: ComponentFixture<RadioCamPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioCamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
