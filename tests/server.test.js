const request = require('supertest');
const express = require('express');
const app = require('../server'); // Assurez-vous que ce chemin est correct selon votre structure de projet

describe('Tetris Server', () => {
  it('should return 200 on the home route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  

});
