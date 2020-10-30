import { Component, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { ValuesService } from './values.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string = 'ADFS Test';
  results: string[] = [];
  claims = {};

  public constructor(private oauthService: OAuthService,
    private valuesService: ValuesService) {

    this.initializeOAuthService();
  }
  ngOnInit(): void {
    this.loadData();
 }

  initializeOAuthService() {

    this.oauthService.configure({
      redirectUri: window.location.origin,
      clientId: 'a160107c-5e89-4ba2-beed-36695bf08465',
      requireHttps: false,
      loginUrl: environment.adfsUrl + '/oauth2/authorize',
      issuer: environment.adfsUrl,
      scope: "openid profile email allatclaims",
      responseType: 'code',
      oidc: true,
      showDebugInformation: true,
      logoutUrl: environment.adfsUrl +
        '/ls/?wa=wsignoutcleanup1.0&wreply=' + location.protocol +
        '//' + location.hostname + (location.port ? ':' + location.port : ''),
      postLogoutRedirectUri: location.protocol + '//' +
        location.hostname + (location.port ? ':' + location.port : '')
    });

    //this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.setStorage(localStorage);

    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.loadDiscoveryDocumentAndTryLogin()
        .then(() => {
          if (!this.oauthService.hasValidAccessToken()) {
            //this.oauthService.initImplicitFlow();
            this.oauthService.initLoginFlow();
          }
        });
    }
  }

  public loadData() {
    this.valuesService.getValues()
      .subscribe((data: string[]) => this.results = data);
  }

  public get name() {

    let claims: any = { claims: this.oauthService.getIdentityClaims(),
      scopes: this.oauthService.getGrantedScopes()
    };
    if (!claims) return null;
    this.claims = claims;
    return claims.unique_name;
  }

  public getClaims(){
    let claims: any = this.oauthService.getIdentityClaims();

    if (!claims) return null;
    this.claims = claims;
    return claims.unique_name;
  }

  public logoutHandler(){
    this.oauthService.logOut();
  }

  public getData()
  {
    this.loadData(); 
  }
}
