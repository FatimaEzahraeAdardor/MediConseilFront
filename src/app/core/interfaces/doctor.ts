import {Specialty} from "./specialty";

export interface Doctor {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  experiences: string;
  diploma: string;
  description: string;
  price: number;
  specialty:Specialty
}
