export class Cms{
    id:number = 0;
    title:string  | null = null;
    content!:string;
    slug:any;
    status:number = 0;
}
export interface ChangeStatusResponse {
    message: string;
  }
  export interface DeleteResponse {
    message: string;
  }