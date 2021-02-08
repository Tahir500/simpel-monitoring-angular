import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IPaginatorView,  PaginatorState, ISortView, SortState, ISearchView} from '../../_metronic/shared/crud-table';
import { AgentServices } from './_services/agent.service';
import { Agent } from './_models/agent.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-agent-manager',
  templateUrl: './agent-manager.component.html',
  styleUrls: ['./agent-manager.component.scss']
})
export class AgentManagerComponent implements OnInit, OnDestroy, IPaginatorView, ISearchView, ISortView {
  agents: Agent[];
  isLoading: boolean;
  paginator: PaginatorState;
  searchGroup: FormGroup;
  sorting: SortState;
  private subscriptions: Subscription[] = [];

  constructor(public agentServices: AgentServices, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    const sb = this.agentServices.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.agentServices.fetch();
    this.paginator = this.agentServices.paginator;
    this.sorting = this.agentServices.sorting;
    this.searchForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  createAgentManager() {
    this.router.navigate(['create-agent-manager']);
  }

  delete(id: number) {
    this.agentServices.deleteAgentManager(id).subscribe(data => {
      console.log(data);
      this.agentServices.fetch();
      this.router.navigate(['/agent-manager'], { relativeTo: this.route });
    })
  }

  paginate(paginator: PaginatorState) {
    this.agentServices.patchState({ paginator });
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged()
      ).subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.agentServices.patchState({ searchTerm });
  }

  sort(column: string): void {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if(!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.agentServices.patchState({ sorting });
  }

}