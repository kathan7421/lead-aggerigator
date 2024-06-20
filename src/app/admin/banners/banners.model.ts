export class Banners {
	id: number = 0;
	title: string | null = null;
	description: string | null = null;
	button_text:string | null = null;
	priority: number | null = null;
	slug: string | null = null;
    image:string ='';
	status:number = 0;
	
}
export interface DeleteResponse {
    message: string;
  }