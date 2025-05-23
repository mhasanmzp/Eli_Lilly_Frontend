import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadExcelComponent } from './download-excel.component';

describe('DownloadExcelComponent', () => {
  let component: DownloadExcelComponent;
  let fixture: ComponentFixture<DownloadExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadExcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
