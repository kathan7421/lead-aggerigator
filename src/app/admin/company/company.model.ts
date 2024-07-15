export class Company {
	id: number = 0;
	name: string | null = null;
	email: string | null = null;
	image?:string | null = null;
	status?:number = 0;
    password:any;
    description:string | null = null;
    fax: string | null = null;
    phone: string | null = null;
    address: string | null = null;
    website: string | null = null;
    logo: string | null = null;
    gst_number: string | null = null;
    register_number: string | null = null;
    cover_photo: string | null = null;
    country: string | null = null;
    city: string | null = null;
    state: string | null = null;
    tag_line: string | null = null;
    document: string | null = null;
    is_active?: string | null = null;
    user_id: number =0;
    // user_type:number=0;
    isActive?: boolean;
	  slug?: string  | null = null;

}
export interface DeleteResponse {
    message: string;
  }
  export interface ChangeStatusResponse {
    message: string;
  }

  export interface CountResponse {
    count: number;
    message: string;
  }