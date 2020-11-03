import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValuesService {

  serviceUrl: string = environment.serviceUrl + '/weatherforecast';
  constructor(private http: HttpClient,
    private oauthService: OAuthService) {

  }

  getAuthHeader() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.oauthService.getAccessToken()
    });
  }


  getValues() {
    if (this.oauthService.hasValidAccessToken()) {
      let x = this.http.get(this.serviceUrl, { headers: this.getAuthHeader() })
        .pipe(
          map(res => res as string[])
        );
        console.log("RESPONSE", x);
      return x;
    } else {
      return of(null);
    }
  }


  hasClaims(){
    if (this.oauthService.hasValidAccessToken()) {
      let x = this.http.get(this.serviceUrl+"/hasclaim/scp/api1 openid", { headers: this.getAuthHeader() })
        .pipe(
          map(res => res as string[])
        );
        console.log("RESPONSE", x);
      return x;
    } else {
      return of(null);
    }
  }
}
