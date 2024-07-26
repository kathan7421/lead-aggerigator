export class Inquiry{
    id: number = 0;
    company_id:number = 0;
    name:string | null = null;
    email:string | null = null;
    phone:string | null = null;
    message:string | null = null;
    service_id:number = 0;
    status!:boolean;
    deleted_at!:any;
    service_name:string | null =null;
    company_name:string | null =null;
    created_at:string | null = null;
}
export interface DeleteResponse {
    message: string;
  }
  export interface ChangeStatusResponse {
    message: string;
  }

