import { getNextLocation, mockVehicles } from "./mockVehicle/mockVehicleStatus";
import { VehicleStatus } from "./model/VehicleStatus";
import { StompClientManager } from "./Queue/ActiveMQ.client";
const Queue = new StompClientManager('vehicle-status-queue');

function mockRandonVehicles() {
  const vehiclesLength = mockVehicles.length;
  const getVehicleRandon = Math.floor(Math.random() * vehiclesLength);
  return mockVehicles[getVehicleRandon];
}

async function main() {
  try {
    await Queue.connect();
    console.log('Conexão STOMP estabelecida com sucesso!');

    setInterval(async () => {
      const vehicle = mockRandonVehicles();
      const nextLocation = getNextLocation(vehicle.origin, vehicle.destination, 10000);
      const vehicleStatus = new VehicleStatus(vehicle.vehicleId, nextLocation.latitude, nextLocation.longitude);
      const status = vehicleStatus.getVehicle();

      console.log(`Enviando status do veículo: ${JSON.stringify(status)}`);
      await Queue.sendMessage(JSON.stringify(status));
    }, 5000); // Envia a cada 5 segundos
  } catch (error: any) {
    console.error('Falha crítica ao iniciar a simulação:', error.message);
    console.error('Verifique se o ActiveMQ está rodando e acessível na porta 61613.');
    process.exit(1); 
  }
}

main().catch((error) => {
  console.error('Erro no serviço principal:', error.message);
});

process.on('SIGINT', () => {
    console.log('\nDesconectando do ActiveMQ...');
    Queue.disconnect();
    process.exit(0);
});