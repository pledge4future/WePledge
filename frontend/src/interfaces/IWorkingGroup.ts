import { IInstitution } from "./IInstitution";
import { IResearchField } from "./IResearchField";

export interface IWorkingGroup {
    id: string, 
    name: string, 
    field: IResearchField, 
    institution: IInstitution

}