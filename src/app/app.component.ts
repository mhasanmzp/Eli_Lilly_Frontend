import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  excelData: any[] = [];
  headers: string[] = [];
  message: string = '';
  success: boolean = false;

  exactMatches: any[] = [];
  partialMatches: any[] = [];
  duplicateRecords: any[] = [];
  potentialMatches: any[] = [];
  uniqueRecords: any[] = [];
  

  // Section toggle states
  showPreviewTable = true;
  showDuplicatesTable = true;
  showPotentialTable = true;
  showUniqueTable = true;
  

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) return;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
      const wsName: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsName];
      const data = XLSX.utils.sheet_to_json(ws) as any[];
      this.excelData = data;
      this.headers = data.length > 0 ? Object.keys(data[0]) : [];
      this.message = '';
      this.success = false;

      // Clear existing matches
      this.exactMatches = [];
      this.partialMatches = [];
      this.uniqueRecords = [];
      this.duplicateRecords = [];
      this.potentialMatches = [];
    };
    reader.readAsBinaryString(target.files[0]);
  }

  selectAllPotential = false;
selectAllUnique = false;

toggleSelectAll(type: 'potential' | 'unique') {
  const list = type === 'potential' ? this.potentialMatches : this.uniqueRecords;
  const flag = type === 'potential' ? this.selectAllPotential : this.selectAllUnique;

  list.forEach(record => record.selected = flag);
}


  // validateData() {
  //   // this.http.post<any>('http://localhost:3000/validate', {
  //     this.http.post<any>('http://localhost:3000/validate-data-excel', {

  //     records: this.excelData,
  //   }).subscribe(
  //     res => {
  //       this.exactMatches = res.exactMatches || [];
  //       this.partialMatches = res.partialMatches || [];
  //       this.uniqueRecords = res.uniqueRecords || [];
  //       this.duplicateRecords = res.duplicates || [];
  //       this.potentialMatches = res.potentialMatches || [];
  //       this.message = res.success ? 'Validation completed.' : 'Validation failed.';
  //       this.success = res.success;

  //       // Show section after validation
  //       this.showUniqueTable = true;

  //     },
  //     err => {
  //       this.message = 'Validation failed.';
  //       this.success = false;
  //     }
  //   );
  // }
  
  validateData() {
    this.http.post<any>('http://localhost:3000/validate-data-excel', {
      records: this.excelData,
    }).subscribe(
      res => {
        // Map API response to component properties
        this.duplicateRecords = res.duplicates || [];
        this.potentialMatches = res.potentialMatches || [];
        this.uniqueRecords = res.uniqueRecords || [];  // This was already correct
        
        // Clear legacy properties
        this.exactMatches = [];
        this.partialMatches = [];
        
        this.message = res.success ? 'Validation completed.' : 'Validation failed.';
        this.success = res.success;
  
        // Ensure sections are visible
        this.showDuplicatesTable = true;
        this.showPotentialTable = true;
        this.showUniqueTable = true;
      },
      err => {
        this.message = 'Validation failed.';
        this.success = false;
      }
    );
  }

  saveUniqueData() {
    this.http.post<any>('http://localhost:5000/save-unique', {
      records: this.uniqueRecords,
    }).subscribe(
      res => {
        this.message = res.message || 'Unique records saved.';
        this.success = true;
        this.exactMatches = [];
        this.partialMatches = [];
        this.uniqueRecords = [];
        this.duplicateRecords = [];
        this.potentialMatches = [];
        this.excelData = [];
      },
      err => {
        this.message = 'Failed to save records.';
        this.success = false;
      }
    );
  }

  getMatchInfo(
    matchedFields: { field: string; matchedValue: string; percentage: number }[],
    key: string
  ) {
    return matchedFields?.find(field => field.field === key);
  }

  toggleSection(section: string) {
    switch (section) {
      case 'preview':
        this.showPreviewTable = !this.showPreviewTable;
        break;
      case 'duplicates':
        this.showDuplicatesTable = !this.showDuplicatesTable;
        break;
      case 'potential':
        this.showPotentialTable = !this.showPotentialTable;
        break;
      case 'unique':
        this.showUniqueTable = !this.showUniqueTable;
        break;
    }
  }
}

