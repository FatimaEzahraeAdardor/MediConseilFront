import {City} from "./city";
import {Specialty} from "./specialty";

export interface Doctor {
  id: string;
  userName: string;
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: Specialty;
  phoneNumber: string;
  city:City;
  address: string;
  experiences: string;
  diploma: string;
  description: string;
  price: number;
  password: string;
}
export interface DoctorRequest {
  id?: string;
  userName: string;
  image?: string;
  firstName: string;
  lastName: string;
  email: string;
  specialtyId: string;
  phoneNumber: string;
  cityId: string;
  address: string;
  experiences: string;
  diploma: string;
  description: string;
  price: number;
  password: string;
}
