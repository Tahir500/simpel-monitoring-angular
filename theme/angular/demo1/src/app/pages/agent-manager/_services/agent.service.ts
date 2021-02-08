import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService, TableResponseModel, ITableState, BaseModel, PaginatorState, SortState, GroupingState } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { baseFilter } from '../../../_fake/fake-helpers/http-extenstions';
import { Agent } from '../_models/agent.model';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

@Injectable({
  providedIn: 'root'
})
export class AgentServices extends TableService<Agent> implements OnDestroy {
  private baseURL = "http://localhost:8080/simpel/v2/agent";
  API_URL = `${this.baseURL}`;

  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  find(tableState: ITableState): Observable<TableResponseModel<Agent>> {
    console.log(this.API_URL);
    return this.http.get<Agent[]>(this.API_URL).pipe(
      map((response: Agent[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Agent> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  getItemById(id: number): Observable<BaseModel> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        console.error('GET ITEM BY IT', id, err);
        return of({ id: undefined });
      })
    );
  }

  createAgentManager(agent: Agent): Observable<Object>{
    return this.http.post(`${this.baseURL}`, agent).pipe(
      catchError(err => {
        console.error('CREATE ITEM', agent, err);
        return of(agent);
      })
    );
  }

  deleteAgentManager(id: number): Observable<Object> {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  update(item: BaseModel): Observable<any> {
    const url = `${this.API_URL}/${item.id}`;
    return this.http.put(url, item).pipe(
      catchError(err => {
        console.error('UPDATE ITEM', item, err);
        return of(item);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
