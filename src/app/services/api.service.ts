import { LoginUtil } from './../utilities/login-util';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HydrusFileId, HydrusFileIds } from '../entities/adding-files';
import { FileSearch } from '../entities/file-search';
import {  HydrusMetadata } from '../entities/hydrus-file';
import { HydrusKeyVerificationData } from '../entities/login';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loginUtil = LoginUtil;
  private backendApi: string;
  private apiKey: string;

  constructor(private http: HttpClient) {
    this.backendApi = LoginUtil.retrieveUrl();
    this.apiKey = this.loginUtil.retrieveKey();
  }

  verifyAccess(api: string, key: string): Observable<HydrusKeyVerificationData> {
    this.backendApi = api;
    this.apiKey=key;
    return this.http
      .get<HydrusKeyVerificationData>(this.backendApi + 'verify_access_key', this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getFilesSearch(tags: string[], sortType: string, sortDir: string): Observable<FileSearch> {
    let searchUrl = LoginUtil.retrieveUrl() + 'get_files/search_files';
    let params = encodeURIComponent(JSON.stringify(tags));
    const httpOptions = {
      headers: {'rejectUnauthorized': 'false', "Hydrus-Client-API-Access-Key": `${this.apiKey}`, "Access-Control-Allow-Origin": "*"},
      params: {'tags':params, 'file_sort_type': sortType, 'file_sort_asc':sortDir}
    };
    
    return this.http
      .get<FileSearch>(searchUrl, httpOptions)
      .pipe(catchError(this.handleError));
  }

  //Delete a single file by id
  deleteFileById(fileid: number): Observable<any> {
    let delUrl = this.backendApi + 'add_files/delete_files';
    const id = new HydrusFileId(fileid);
    return this.http
      .post<any>(delUrl, id, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  //Delete a list of  files by id
  deleteMultipleFilesById(fileids: number[]): Observable<any> {
    let delUrl = this.backendApi + 'add_files/delete_files';
    const ids = new HydrusFileIds(fileids);
    return this.http
      .post<any>(delUrl, ids, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }


  //Delete a single file by id
  archiveFileById(fileid: number): Observable<any> {
    let delUrl = this.backendApi + 'add_files/archive_files';
    const id = new HydrusFileId(fileid);
    return this.http
      .post<any>(delUrl, id, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  //Delete a list of  files by id
  archiveMultipleFilesById(fileids: number[]): Observable<any> {
    let delUrl = this.backendApi + 'add_files/archive_files';
    const ids = new HydrusFileIds(fileids);
    return this.http
      .post<any>(delUrl, ids, this.setHttpOptions())
      .pipe(catchError(this.handleError));
  }

  //might have to be changed to be similar to getthumbnail, only returning a string
  getFiles(fileId: number): any {
    let searchUrl = `${this.backendApi}file`;
    const httpOptions = {
      headers: {"Access-Control-Allow-Origin": "*", "Hydrus-Client-API-Access-Key": `${this.apiKey}`},
      params: {'file_id':fileId}
      
    };
    
    return this.http
      .get<any>(searchUrl, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getFileMetadata(fileIds: number[]): Observable<HydrusMetadata> {
    let searchUrl = this.backendApi + 'get_files/file_metadata';
    let params = encodeURIComponent(JSON.stringify(fileIds));
    const httpOptions = {
      headers: {'rejectUnauthorized': 'false', "Hydrus-Client-API-Access-Key": `${this.apiKey}`, "Access-Control-Allow-Origin": "*"},
      params: {'file_ids':params}
    };
    
    return this.http
      .get<HydrusMetadata>(searchUrl, httpOptions)
      .pipe(catchError(this.handleError));
  }

  //Doesn't seem to work as sub maybe due to blob ?
  public getThumbnailURLFromId(file_id: number): string {
    return this.backendApi + 'get_files/thumbnail?file_id=' + file_id + '&Hydrus-Client-API-Access-Key=' + this.apiKey;
  }

    /********************** MISC **************************************** */

  /**
   * Setting HTTP OPTIONS
   * ignore/avoid certificate errors - 'ignore SEC_ERROR_UNKNOWN_ISSUER' (rejectUnauthorized)
   * place API key in header
   */
   setHttpOptions(): {} {
    return {
      headers: new HttpHeaders({
        'rejectUnauthorized': 'false'
      }).set("Hydrus-Client-API-Access-Key", `${this.apiKey}`),
    };
  }

  /**
   * ERROR HANDLING
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    // return an observable with a user-facing error message
    return throwError(error.error);
  }

}
