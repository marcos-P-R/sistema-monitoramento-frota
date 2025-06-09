import stompit, { Client } from 'stompit';

export class StompClientManager {
  private client: stompit.Client | null;
  private readonly connectOptions: any;
  private readonly host: string = process.env.ACTIVEMQ_HOST ?? 'localhost';
  private readonly port: number = parseInt(process.env.ACTIVEMQ_PORT ?? '61613', 10);

  constructor(
    private readonly queueName: string,
  ) {
    this.client = null;
    this.connectOptions = {
      host: this.host,
      port: this.port,
      connectHeaders: {
        host: '/',
        login: process.env.ACTIVEMQ_LOGIN ?? '',
        passcode: process.env.ACTIVEMQ_PASSCODE ?? '',
        'heart-beat': '5000,5000',
      }
    }
  }

  async connect(): Promise<Client> {
    if (this.client) {
      console.log('Já conectado ao STOMP. Reconexão não necessária.');
      Promise.reject(new Error('Já conectado ao STOMP. Reconexão não necessária.'));
    }

    console.log(`Tentando conectar ao ActiveMQ em ws://${this.host}:${this.port}...`);

    return new Promise((resolve, reject) => {
      stompit.connect(this.connectOptions, (error, client) => {
        if (error) {
          console.error('Erro ao conectar ao ActiveMQ:', error);
          return reject(new Error(error instanceof Error ? error.message : String(error)));
        }

        client.on('error', (err) => {
          console.error('Erro na conexão STOMP:', err.message);
          this.client = null;
        });

        this.client = client;
        resolve(client);
      })
    })
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.client) {
      console.warn('Conexão STOMP não estabelecida. Tentando reconectar...');
      try {
        await this.connect(); 
        if (!this.client) {
          throw new Error('Falha ao reconectar ao STOMP. Não é possível enviar a mensagem.');
        }
      } catch (error: any) {
        console.error('Erro ao reconectar e enviar mensagem:', error.message);
        throw error;
      }
    }

    const sendHeaders = {
      destination: this.queueName,
      'content-type': 'application/json',
    }

    return new Promise((resolve, reject) => {
      if (this.client) {
        const frame = this.client.send(sendHeaders);
        frame.write(message);
        frame.end();
        console.log('Mensagem enviada com sucesso:', message);
        resolve();
      } else {
        reject(new Error('STOMP client não está conectado.'));
      }
    })
  }

  disconnect(): void {
    if (this.client) {
      this.client.disconnect((error) => {
        if (error) {
          console.error('Erro ao desconectar do STOMP:', error.message);
        } else {
          console.log('Desconectado do STOMP com sucesso.');
        }
      });
      this.client = null;
    } else {
      console.warn('Nenhuma conexão STOMP ativa para desconectar.');
    }
  }
}