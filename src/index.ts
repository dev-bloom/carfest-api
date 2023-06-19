import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
import {ApplicationConfig, ObscureListApiApplication} from './application';

export * from './application';

const firebaseConfig = {
  apiKey: 'AIzaSyByr6vfPscujiB4zfyPlmO4_WYhR7JPeh0',
  authDomain: 'carfest-9bd76.firebaseapp.com',
  projectId: 'carfest-9bd76',
  storageBucket: 'carfest-9bd76.appspot.com',
  messagingSenderId: '189322879065',
  appId: '1:189322879065:web:788bc592baf4b6c9981148',
  measurementId: 'G-QR2WFL28B6',
};

export async function main(options: ApplicationConfig = {}) {
  const app = new ObscureListApiApplication(options);
  await app.boot();
  await app.start();

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage(firebaseApp);
  app.storage = storage;

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
