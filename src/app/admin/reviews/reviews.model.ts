export class Review{
    id: number = 0;
    company_id:number = 0;
    comment:string | null = null;
    status:number = 0;
    rating:number = 0;
    // deleted_at!:any;
    company_name:string | null =null;
    created_at:string | null = null;
}
export interface DeleteResponse {
    message: string;
  }
  export interface ChangeStatusResponse {
    message: string;
  }

