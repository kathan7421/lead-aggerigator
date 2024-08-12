export class Review{
    id: number = 0;
    company_id!:string;
    comment:string | null = null;
    status!:string ;
    rating:number = 0;
    // deleted_at!:any;
    company_name:string | null =null;
    created_at:string | null = null;
}
export interface AddReview {
  company_id?:Company;
  comment:string;
    rating?:number ;
}
export interface Company {
  label: string;
  value: number;
}
export interface DeleteResponse {
    message: string;
  }
  export interface ChangeStatusResponse {
    message: string;
  }

