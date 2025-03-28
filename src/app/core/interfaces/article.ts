import {Category} from "./category";
import {Doctor} from "./doctor";

export interface Article {
  id:string;
  title: string;
  content: string;
  created_at:string;
  image?: string;
  category: Category;
  doctor: Doctor;

}
