import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitemanageComponent } from './sitemanage.component';

describe('SitemanageComponent', () => {
  let component: SitemanageComponent;
  let fixture: ComponentFixture<SitemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
