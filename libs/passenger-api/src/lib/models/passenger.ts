export enum PassengerStatus {
  A = 'A',
  B = 'B',
  C = 'C'
}

export interface Passenger {
  id: number;
  firstName: string;
  bonusMiles: number;
  name: string;
  passengerStatus: PassengerStatus;
}
