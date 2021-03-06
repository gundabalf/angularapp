import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';

import { Article } from '../model/article.model';
import { AppComponent } from './app.component';

import { DataTable } from 'primeng/primeng';
import { Column } from 'primeng/primeng';
import { Header } from 'primeng/primeng';
import { Footer } from 'primeng/primeng';
import { LazyLoadEvent } from 'primeng/primeng';
import { Paginator } from 'primeng/primeng';

@Component({
    selector: 'article-table',
    inputs: ['articles', 'totalRecords'],
    outputs: ['onLazyLoadArticles', 'onRowSelectEmitter'],
    template: `
        <p-dataTable #ref
                     [value]="articles" 
                     selectionMode="single" 
                     [(selection)]="selectedArticle" 
                     (onRowSelect)="onRowSelect($event)"
                     resizableColumns="true" 
                     [lazy]="true"
                     (onLazyLoad)="loadArticlesLazy($event)"
                     [rows]="rows" >
            <header>Article table</header>
            <p-column field="id" header="id" [sortable]="true" [style]="{'width':'3.5em'}"></p-column>
            <p-column field="pzn" header="PZN" [sortable]="true" [style]="{'width':'5em'}"></p-column>
            <p-column field="name" header="Name" [sortable]="true" [style]="{'width':'20em'}"></p-column>
            <p-column field="provider" header="Supplier" [style]="{'width':'15em'}"></p-column>
            <p-column field="dosage" header="Dosage" [style]="{'width':'4em'}"></p-column>
            <p-column field="packaging" header="Packaging" [style]="{'width':'5em'}"></p-column>
            <p-column field="sellingPrice" header="SPrice" [style]="{'width':'4em'}"></p-column>
            <p-column field="purchasingPrice" header="PPrice" [style]="{'width':'4em'}"></p-column>
            <p-column field="narcotic" header="BTM" [style]="{'width':'4em'}">
                <template let-article="rowData">
                    <i *ngIf="article.narcotic == false" class="fa fa-check" style="color:blue"></i>
                    <i *ngIf="article.narcotic == true" class="fa fa-ban" style="color:red"></i>
                </template>
            </p-column>
            <p-column field="stock" header="Stock" [style]="{'width':'4em'}">
                <template let-article="rowData">
                    <div *ngIf="article.stock == 0">{{article.stock}}</div>
                    <div *ngIf="article.stock > 0" style="background-color:green">{{article.stock}}</div>
                </template>
            </p-column>
        </p-dataTable>
        <p-paginator #pag 
                     [rows]="rows" 
                     [totalRecords]="totalRecords" 
                     [pageLinkSize]="3" 
                     styleClass="ui-paginator-bottom"
                     (onPageChange)="paginate($event)" 
                     [rowsPerPageOptions]="[5,10,20,50,100,500,1000]">
        </p-paginator>
    `,
    directives: [DataTable, Column, Header, Footer, Paginator]
})
export class ArticleTableComponent {

    @ViewChild('ref') ref: DataTable;
    @ViewChild('pag') pag: Paginator;

    onLazyLoadArticles: EventEmitter<LazyLoadEvent>;
    onRowSelectEmitter: EventEmitter<Article>;

    totalRecords: Number;

    rows = 10;

    articles: Article[];

    selectedArticle: Article;

    constructor() {
        this.onLazyLoadArticles = new EventEmitter();
        this.onRowSelectEmitter = new EventEmitter<Article>();
    }

    resetPaginator() {
        this.pag.changePageToFirst();
    }

    reloadPaginator() {
        this.pag.changePage(this.pag.getPage());
    }

    loadArticlesLazy(event: LazyLoadEvent) {
        this.selectedArticle = undefined;
        this.onLazyLoadArticles.emit(event);
    }

    onRowSelect(event) {
        this.onRowSelectEmitter.emit(event.data);
    }

    paginate(event) {
        this.ref.paginate(event);
    }

}