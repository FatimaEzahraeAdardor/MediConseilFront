export interface Availability {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}
