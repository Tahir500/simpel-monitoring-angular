import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Agent extends BaseModel {
    id: number;
    agentName: string;
    configuration: string;
    urlEntryPoint: string;
    cronExpression: string;
    createdBy: string;
    createdDate: Date;
    lastUpdateBy: string;
    lastUpdateDate: Date;
    description: string;
    agentParam: string;
}