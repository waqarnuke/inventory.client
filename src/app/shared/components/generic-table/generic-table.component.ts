import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, viewChild, ViewChild } from '@angular/core';
import { merge, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-generic-table',
  imports: [NgIf,NgFor, MatTableModule, MatPaginatorModule,NgSwitch,NgSwitchCase,NgSwitchDefault,MatPaginatorModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent<T> implements OnChanges, OnDestroy, AfterViewInit  {

  private dataSub?: Subscription;
  
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() page = new EventEmitter<PageEvent>();

  @Input() columns: any[] = [];
  @Input() data: Observable<{ data: T[],totalCount:number,pageIndex:number,pageSize:number }> = of({ data: [],totalCount:0,pageIndex:0,pageSize:0 });
  
  dataSource = new MatTableDataSource<any>();
 
  pageIndex : number = 0;
  pageSize : number = 0;
  total :number = 0;
  
  ngOnChanges(): void {
    if (this.dataSub) this.dataSub.unsubscribe();
    this.dataSub =  this.data.subscribe(res => {
      this.dataSource.data = res.data;
      this.pageIndex = res.pageIndex;
      this.pageSize = res.pageSize
      this.total = res.totalCount;
    });
  }

  ngAfterViewInit(): void {
  }

  get displayedColumns() {
    return this.columns.filter(c => c.visible).map(c => c.key);
  }

  onEdit(row: T) {
    this.edit.emit(row);
  }
  
  onDelete(row: T) {
    this.delete.emit(row);
  }

  pagenationEvent(event:PageEvent){ 
    this.page.emit(event);
  }
  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }
}
