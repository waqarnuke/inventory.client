import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Brand } from '../../shared/model/brand';
import { Model } from '../../shared/model/model';
import { MobileNetwork } from '../../shared/model/mobileNetwork';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Storage } from '../../shared/model/storage';
import { Pagination } from '../../shared/model/pagination';
import { product } from '../../shared/model/product';
import { image } from '../../shared/model/image';
import { Supplier } from '../../shared/model/supplier';
import { buyingItem } from '../../shared/model/buyingItem';

@Injectable({
  providedIn: 'root'
})
export class inventoryService {

  private _brands = new BehaviorSubject<Brand[]>([]);
  private _model = new BehaviorSubject<Model[]>([]);
  private _mobileNetwork = new BehaviorSubject<MobileNetwork[]>([]);
  private _storage = new BehaviorSubject<Storage[]>([]);
  private _supplier = new BehaviorSubject<Supplier[]>([]);
  // private _products = new BehaviorSubject<Pagination<product>>({
  //   data: [],
  //   totalCount: 0,
  //   pageIndex: 0,
  //   pageSize: 10
  // });
  // products$ = this._products.asObservable();

  httpClient = inject(HttpClient) 
  baseUrl = "https://localhost:5001/api/";
  constructor() 
  { 
  }

  get brands$() {
    return this._brands.asObservable();
  }

  get model$() {
    return this._model.asObservable();
  }

  get storage$() {
    return this._storage.asObservable();
  }
  
  get mobileNetwork$() {
    return this._mobileNetwork.asObservable();
  }

  get supplier$() {
    return this._supplier.asObservable();
  }

  getBrands():Observable<Brand[]>{
    return this.httpClient.get<Brand[]>(this.baseUrl + 'brands')
      .pipe(
        tap((brand) =>
        {
          this._brands.next(brand);
        })
      ); 
  }

  getModel(){
    return this.httpClient.get<Model[]>(this.baseUrl + 'model')
    .pipe(
      tap((model) =>
      {
        this._model.next(model);
      })
    ); 
  }

  getMobileNetwork(){
    return this.httpClient.get<MobileNetwork[]>(this.baseUrl + 'mobilenetwork')
    .pipe(
      tap((mobile) =>
      {
        this._mobileNetwork.next(mobile);
      })
    ); 
  }

  getStorage(){
    return this.httpClient.get<Storage[]>(this.baseUrl + 'storage')
    .pipe(
      tap((storage) =>
      {
        this._storage.next(storage);
      })
    );  
  }

  getSupplier():Observable<Supplier[]>{
    return this.httpClient.get<Supplier[]>(this.baseUrl + 'supplier')
      .pipe(
        tap((_supplier) =>
        {
          this._supplier.next(_supplier);
        })
      ); 
  }

  getproducts(pageindex:number,pagesize:number,){
    let httpParams  =  new HttpParams()
    .set('index', pageindex)
    .set('size', pagesize)

    return this.httpClient.get<Pagination<any>>(this.baseUrl + 'item/getPaginatedItems', {params: httpParams });
  }

  getProductById(id:number){
    
    return this.httpClient.get<product>(this.baseUrl + 'item/' + id);
  }

  addProduct(product:product){
    console.log(product);
    //return product;
    return this.httpClient.post<product>(this.baseUrl + 'item', product);
  }

  uploadImages(data: FormData): Observable<any> {
    // let params = new HttpParams()
    //                 .set('userId',userId)
    // const formData = new FormData();
    // formData.append('file', file);

    return this.httpClient.post<image>(this.baseUrl + 'item/upload-images' , data);
  }

  updateProduct(product:product){
    return this.httpClient.put<product>(this.baseUrl + 'item/' + product.id, product);
  }

  deleteProduct(id:number){
    return this.httpClient.delete(this.baseUrl + 'item/' + id);
  }

  deleteProductImage(id:number){
    return this.httpClient.delete(this.baseUrl + 'item/deletephoto/' + id);
  }

  searchProduct(search:string)
  {
    let httpParams  =  new HttpParams()
    .set('query', search)

    return this.httpClient.get<product[]>(this.baseUrl + 'item/search', {params: httpParams });
  }

  addBuyingProduct(product:product){
    console.log(product);
    //return product;
    return this.httpClient.post<buyingItem>(this.baseUrl + 'item/CreateByingItem', product);
  }
  //
}
