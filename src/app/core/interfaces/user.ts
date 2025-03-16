
export interface User {
  id?: string;
  userName: string;
  image?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city_id: string;
  password: string;
}
export interface ApiResponse<T>{
  status?: boolean;
  message?: string;
  error?: string;
  token?: string;
  data?: T;
}
