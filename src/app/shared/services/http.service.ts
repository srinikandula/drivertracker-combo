import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrlsService } from '@app/shared/services/api-urls.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private _httpClient: HttpClient,
    private apiUrls: ApiUrlsService
  ) {}

  getAll(subUrl: any, data: any) {
    return this._httpClient.post(this.apiUrls.mainUrl + subUrl, data);
  }

  get(subUrl: any) {
    return this._httpClient.get(this.apiUrls.mainUrl + subUrl);
  }

  update(subUrl: any, data: any) {
    return this._httpClient.put(this.apiUrls.mainUrl + subUrl, data);
  }

  delete(subUrl: any) {
    return this._httpClient.delete(this.apiUrls.mainUrl + subUrl);
  }
}
