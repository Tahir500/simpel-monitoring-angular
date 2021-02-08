import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgentManagerComponent } from './create-agent-manager.component';

describe('CreateAgentManagerComponent', () => {
  let component: CreateAgentManagerComponent;
  let fixture: ComponentFixture<CreateAgentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgentManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
