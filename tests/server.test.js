const request = require('supertest');
const express = require('express');
const app = express();
const port = 3000;

// Votre code serveur
app.get('/', (req, res) => {
  res.status(200).send('Hello, Tetris!');
});

// Démarrer le serveur avant les tests
let server;

beforeAll(() => {
  server = app.listen(port, () => {
    console.log(`Tetris app listening at http://localhost:${port}`);
  });
});

// Test pour vérifier le retour 200 sur la route principale
describe('Tetris Server', () => {
  it('should return 200 on the home route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

// Fermer le serveur après les tests
afterAll((done) => {
  server.close(() => {
    console.log('Tetris app closed');
    done(); // Signale à Jest que tout est terminé
  });
});
