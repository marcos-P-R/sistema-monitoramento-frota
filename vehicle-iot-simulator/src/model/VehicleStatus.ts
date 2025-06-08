interface VehicleStatusInterface {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  timeStamp: string;
}

export class VehicleStatus {
  constructor(
    private readonly vehicleId: string,
    private readonly latitude: number,
    private readonly longitude: number,
  ) {}

  getVehicle(): VehicleStatusInterface {
    return {
      vehicleId: this.vehicleId,
      latitude: this.latitude,
      longitude: this.longitude,
      speed: this.getRandonSpeed(),
      timeStamp: new Date().toISOString(),
    };
  }

  private getRandonSpeed(): number {
    const minSpeed = 0;
    const maxSpeed = 160;
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
  } 
}