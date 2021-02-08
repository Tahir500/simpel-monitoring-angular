import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agent } from '../../_models/agent.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AgentServices } from '../../_services/agent.service';

const EMPTY_AGENT: Agent = {
  id: undefined,
  agentName: '',
  configuration: '',
  urlEntryPoint: '',
  cronExpression: '',
  createdBy: '',
  createdDate: undefined,
  lastUpdateBy: '',
  lastUpdateDate: undefined,
  description: '',
  agentParam: '',
};

@Component({
  selector: 'app-create-agent-manager',
  templateUrl: './create-agent-manager.component.html',
  styleUrls: ['./create-agent-manager.component.scss']
})
export class CreateAgentManagerComponent implements OnInit, OnDestroy {
  id: number;
  agent: Agent;
  previous: Agent;
  formGroup: FormGroup;
  errorMessage = '';
  isLoading$: Observable<boolean>;
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, private agentServices: AgentServices, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading$ = this.agentServices.isLoading$;
    this.loadAgent();
  }

  loadAgent() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          return this.agentServices.getItemById(this.id);
        }
        return of(EMPTY_AGENT);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: Agent) => {
      if (!res) {
        this.router.navigate(['/agent-manager'], { relativeTo: this.route });
      }

      this.agent = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.agent = Object.assign(this.agent, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.agentServices.update(this.agent).pipe(
      tap(() => this.router.navigate(['/agent-manager'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.agent);
      })
    ).subscribe(res => this.agent = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.agentServices.createAgentManager(this.agent).pipe(
      tap(() => this.router.navigate(['/agent-manager'])),
      catchError((errorMessage) => {
        console.error('CREATE ERROR', errorMessage);
        return of(this.agent);
      })
    ).subscribe(res => this.agent = res as Agent);
    this.subscriptions.push(sbCreate);
    this.reset();
    console.log(this.agent);
  }

  loadForm() {
    if (!this.agent) {
      return;
    }

    this.formGroup = this.fb.group({
      agentName: [this.agent.agentName, Validators.compose([Validators.required])],
      urlEntryPoint: [this.agent.urlEntryPoint, Validators.compose([Validators.required])],
      cronExpression: [this.agent.cronExpression, Validators.compose([Validators.required])],
      configuration: [this.agent.configuration, Validators.compose([Validators.required])],
      agentParam: [this.agent.agentParam],
      description: [this.agent.description]
    });
  }

  reset() {
    this.agent.id = undefined;
    this.agent.agentName = '';
    this.agent.configuration = '';
    this.agent.urlEntryPoint = '';
    this.agent.cronExpression = '';
    this.agent.createdBy = '';
    this.agent.createdDate = undefined;
    this.agent.lastUpdateBy = '';
    this.agent.lastUpdateDate = undefined;
    this.agent.description = '';
    this.agent.agentParam = '';
    this.loadForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

}