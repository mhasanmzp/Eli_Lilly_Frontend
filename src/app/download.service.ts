import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private downloadUrl = '../../public'; // URL of the file in the backend

  constructor(private http: HttpClient) {}

  downloadFile(): Observable<Blob> {
    return this.http.get(this.downloadUrl, { responseType: 'blob' });
  }
}
