import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { AutocadastroInfo } from '../model/autocadastroInfo';
// @ts-ignore
import { ClientesCpfRejeitarPostRequest } from '../model/clientesCpfRejeitarPostRequest';
// @ts-ignore
import { ClientesGet200Response } from '../model/clientesGet200Response';
// @ts-ignore
import { ContaResponse } from '../model/contaResponse';
// @ts-ignore
import { DadosClienteResponse } from '../model/dadosClienteResponse';
// @ts-ignore
import { PerfilInfo } from '../model/perfilInfo';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import { BaseService } from '../api.base.service';



@Injectable({
  providedIn: 'root'
})
export class ClientesService extends BaseService {

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string|string[], @Optional() configuration?: Configuration) {
        super(basePath, configuration);
    }

    /**
     * aprova o cliente com o cpf passado
     * @param cpf CPF do cliente a ser aprovado
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public clientesCpfAprovarPost(cpf: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<ContaResponse>;
    public clientesCpfAprovarPost(cpf: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<ContaResponse>>;
    public clientesCpfAprovarPost(cpf: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<ContaResponse>>;
    public clientesCpfAprovarPost(cpf: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (cpf === null || cpf === undefined) {
            throw new Error('Required parameter cpf was null or undefined when calling clientesCpfAprovarPost.');
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

        let localVarPath = `/clientes/${this.configuration.encodeParam({name: "cpf", value: cpf, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/aprovar`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<ContaResponse>('post', `${basePath}${localVarPath}`,
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
     * Consulta um cliente
     * @param cpf 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public clientesCpfGet(cpf: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<DadosClienteResponse>;
    public clientesCpfGet(cpf: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<DadosClienteResponse>>;
    public clientesCpfGet(cpf: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<DadosClienteResponse>>;
    public clientesCpfGet(cpf: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (cpf === null || cpf === undefined) {
            throw new Error('Required parameter cpf was null or undefined when calling clientesCpfGet.');
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

        let localVarPath = `/clientes/${this.configuration.encodeParam({name: "cpf", value: cpf, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<DadosClienteResponse>('get', `${basePath}${localVarPath}`,
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
     * altera os dados de perfil de cliente
     * @param cpf 
     * @param perfilInfo 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public clientesCpfPut(cpf: string, perfilInfo?: PerfilInfo, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<any>;
    public clientesCpfPut(cpf: string, perfilInfo?: PerfilInfo, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<any>>;
    public clientesCpfPut(cpf: string, perfilInfo?: PerfilInfo, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<any>>;
    public clientesCpfPut(cpf: string, perfilInfo?: PerfilInfo, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (cpf === null || cpf === undefined) {
            throw new Error('Required parameter cpf was null or undefined when calling clientesCpfPut.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (bearerAuth) required
        localVarHeaders = this.configuration.addCredentialToHeaders('bearerAuth', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
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

        let localVarPath = `/clientes/${this.configuration.encodeParam({name: "cpf", value: cpf, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<any>('put', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: perfilInfo,
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
     * rejeita o cliente com o cpf passado
     * @param cpf CPF do cliente a ser rejeitado
     * @param clientesCpfRejeitarPostRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public clientesCpfRejeitarPost(cpf: string, clientesCpfRejeitarPostRequest?: ClientesCpfRejeitarPostRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<any>;
    public clientesCpfRejeitarPost(cpf: string, clientesCpfRejeitarPostRequest?: ClientesCpfRejeitarPostRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<any>>;
    public clientesCpfRejeitarPost(cpf: string, clientesCpfRejeitarPostRequest?: ClientesCpfRejeitarPostRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<any>>;
    public clientesCpfRejeitarPost(cpf: string, clientesCpfRejeitarPostRequest?: ClientesCpfRejeitarPostRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (cpf === null || cpf === undefined) {
            throw new Error('Required parameter cpf was null or undefined when calling clientesCpfRejeitarPost.');
        }

        let localVarHeaders = this.defaultHeaders;

        // authentication (bearerAuth) required
        localVarHeaders = this.configuration.addCredentialToHeaders('bearerAuth', 'Authorization', localVarHeaders, 'Bearer ');

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
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

        let localVarPath = `/clientes/${this.configuration.encodeParam({name: "cpf", value: cpf, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/rejeitar`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<any>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: clientesCpfRejeitarPostRequest,
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
     * consulta todos os clientes
     * @param filtro Define qual tipo de busca será feita.    - _para_aprovar_: (GERENTE) busca os clientes que aguardam aprovação    - _adm_relatorio_clientes_: (ADMINISTRADOR) busca todos os clientes para tirar o relatório, com dados de cliente, conta e gerente    - _melhores_clientes_: (GERENTE) busca os 3 melhores clientes    &lt;sem filtro&gt;: (GERENTE) busca todos os clientes com conta 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public clientesGet(filtro?: 'para_aprovar' | 'adm_relatorio_clientes' | 'melhores_clientes', observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<ClientesGet200Response>;
    public clientesGet(filtro?: 'para_aprovar' | 'adm_relatorio_clientes' | 'melhores_clientes', observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<ClientesGet200Response>>;
    public clientesGet(filtro?: 'para_aprovar' | 'adm_relatorio_clientes' | 'melhores_clientes', observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<ClientesGet200Response>>;
    public clientesGet(filtro?: 'para_aprovar' | 'adm_relatorio_clientes' | 'melhores_clientes', observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
          <any>filtro, 'filtro');

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

        let localVarPath = `/clientes`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<ClientesGet200Response>('get', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
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
     * autocadastro de cliente
     * @param autocadastroInfo 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public clientesPost(autocadastroInfo?: AutocadastroInfo, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<any>;
    public clientesPost(autocadastroInfo?: AutocadastroInfo, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<any>>;
    public clientesPost(autocadastroInfo?: AutocadastroInfo, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<any>>;
    public clientesPost(autocadastroInfo?: AutocadastroInfo, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext, transferCache?: boolean}): Observable<any> {

        let localVarHeaders = this.defaultHeaders;

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
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

        let localVarPath = `/clientes`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<any>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: autocadastroInfo,
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
