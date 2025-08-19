import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { ContasNumeroDepositarPostRequest } from '../model/contasNumeroDepositarPostRequest';
// @ts-ignore
import { ContasNumeroSacarPostRequest } from '../model/contasNumeroSacarPostRequest';
// @ts-ignore
import { ContasNumeroTransferirPostRequest } from '../model/contasNumeroTransferirPostRequest';
// @ts-ignore
import { ExtratoResponse } from '../model/extratoResponse';
// @ts-ignore
import { OperacaoResponse } from '../model/operacaoResponse';
// @ts-ignore
import { SaldoResponse } from '../model/saldoResponse';
// @ts-ignore
import { TransferenciaResponse } from '../model/transferenciaResponse';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import { BaseService } from '../api.base.service';



@Injectable({
  providedIn: 'root'
})
export class ContasService extends BaseService {

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string|string[], @Optional() configuration?: Configuration) {
        super(basePath, configuration);
    }

    /**
     * deposita um valor na conta do cliente
     * @param numero Número da conta
     * @param contasNumeroDepositarPostRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public contasNumeroDepositarPost(numero: string, contasNumeroDepositarPostRequest?: ContasNumeroDepositarPostRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<OperacaoResponse>;
    public contasNumeroDepositarPost(numero: string, contasNumeroDepositarPostRequest?: ContasNumeroDepositarPostRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<OperacaoResponse>>;
    public contasNumeroDepositarPost(numero: string, contasNumeroDepositarPostRequest?: ContasNumeroDepositarPostRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<OperacaoResponse>>;
    public contasNumeroDepositarPost(numero: string, contasNumeroDepositarPostRequest?: ContasNumeroDepositarPostRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (numero === null || numero === undefined) {
            throw new Error('Required parameter numero was null or undefined when calling contasNumeroDepositarPost.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (bearerAuth) required
        localVarHeaders = this.configuration.addCredentialToHeaders('bearerAuth', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/contas/${this.configuration.encodeParam({name: "numero", value: numero, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/depositar`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<OperacaoResponse>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: contasNumeroDepositarPostRequest,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retorna o extrado da conta
     * @param numero Número da conta
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public contasNumeroExtratoPost(numero: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<ExtratoResponse>;
    public contasNumeroExtratoPost(numero: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<ExtratoResponse>>;
    public contasNumeroExtratoPost(numero: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<ExtratoResponse>>;
    public contasNumeroExtratoPost(numero: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (numero === null || numero === undefined) {
            throw new Error('Required parameter numero was null or undefined when calling contasNumeroExtratoPost.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (bearerAuth) required
        localVarHeaders = this.configuration.addCredentialToHeaders('bearerAuth', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/contas/${this.configuration.encodeParam({name: "numero", value: numero, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/extrato`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<ExtratoResponse>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Saca um valor da conta do cliente
     * @param numero Número da conta
     * @param contasNumeroSacarPostRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public contasNumeroSacarPost(numero: string, contasNumeroSacarPostRequest?: ContasNumeroSacarPostRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<OperacaoResponse>;
    public contasNumeroSacarPost(numero: string, contasNumeroSacarPostRequest?: ContasNumeroSacarPostRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<OperacaoResponse>>;
    public contasNumeroSacarPost(numero: string, contasNumeroSacarPostRequest?: ContasNumeroSacarPostRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<OperacaoResponse>>;
    public contasNumeroSacarPost(numero: string, contasNumeroSacarPostRequest?: ContasNumeroSacarPostRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (numero === null || numero === undefined) {
            throw new Error('Required parameter numero was null or undefined when calling contasNumeroSacarPost.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (bearerAuth) required
        localVarHeaders = this.configuration.addCredentialToHeaders('bearerAuth', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/contas/${this.configuration.encodeParam({name: "numero", value: numero, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/sacar`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<OperacaoResponse>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: contasNumeroSacarPostRequest,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * retorna o saldo da conta
     * @param numero Número da conta
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public contasNumeroSaldoPost(numero: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<SaldoResponse>;
    public contasNumeroSaldoPost(numero: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<SaldoResponse>>;
    public contasNumeroSaldoPost(numero: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<SaldoResponse>>;
    public contasNumeroSaldoPost(numero: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (numero === null || numero === undefined) {
            throw new Error('Required parameter numero was null or undefined when calling contasNumeroSaldoPost.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (bearerAuth) required
        localVarHeaders = this.configuration.addCredentialToHeaders('bearerAuth', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/contas/${this.configuration.encodeParam({name: "numero", value: numero, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/saldo`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<SaldoResponse>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Saca um valor da conta do cliente
     * @param numero Número da conta
     * @param contasNumeroTransferirPostRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public contasNumeroTransferirPost(numero: string, contasNumeroTransferirPostRequest?: ContasNumeroTransferirPostRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<TransferenciaResponse>;
    public contasNumeroTransferirPost(numero: string, contasNumeroTransferirPostRequest?: ContasNumeroTransferirPostRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<TransferenciaResponse>>;
    public contasNumeroTransferirPost(numero: string, contasNumeroTransferirPostRequest?: ContasNumeroTransferirPostRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<TransferenciaResponse>>;
    public contasNumeroTransferirPost(numero: string, contasNumeroTransferirPostRequest?: ContasNumeroTransferirPostRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (numero === null || numero === undefined) {
            throw new Error('Required parameter numero was null or undefined when calling contasNumeroTransferirPost.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (bearerAuth) required
        localVarHeaders = this.configuration.addCredentialToHeaders('bearerAuth', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/contas/${this.configuration.encodeParam({name: "numero", value: numero, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/transferir`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<TransferenciaResponse>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: contasNumeroTransferirPostRequest,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

}
