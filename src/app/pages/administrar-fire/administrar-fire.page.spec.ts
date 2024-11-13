import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrarFirePage } from './administrar-fire.page';

describe('AdministrarFirePage', () => {
  let component: AdministrarFirePage;
  let fixture: ComponentFixture<AdministrarFirePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarFirePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
