import * as jwt from 'jwt-simple';
import { app, request, expect } from './config/helpers';
import * as HTTPStatus from 'http-status';

describe('Testes de Integraçcão', () => {

    'use strict';

    const config = require('../../server/config/env/config')();
    const model = require('../../server/models');

    let token;
    let id;

    const userTest = {
        id: 100,
        name: 'Usuário Teste',
        email: 'teste@email.com',
        password: 'teste'
    };

    const userDefualt = {
        id: 2,
        name: 'Paulo',
        email: 'paulo@email.com',
        password: '123'
    };

    beforeEach((done) => {
        model.User.destroy({where: {}})
            .then(() => {
                return model.User.create(userDefualt);
            })
            .then(user => {
                model.User.create(userTest)
                    .then(() => {                        
                        token = jwt.encode({id: user.id}, config.secret);
                        done();
                    });
            });
    });

    describe('POST /token', () => {
        it('Deve receber um JWT', done => {
            const credentials = {
                email: userDefualt.email,
                password: userDefualt.password
            };

            request(app)
                .post('/token')
                .send(credentials)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK)
                    expect(res.body.token).to.equal(`${token}`)
                    done(error);
                });
        });

        it('Não deve gerar Token', done => {
            const credentials = {
                email: 'email@qualquer.com',
                password: 'qualquer123'
            };

            request(app)
                .post('/token')
                .send(credentials)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.UNAUTHORIZED)
                    expect(res.body).to.empty
                    done(error);
            });
        });
    });

    describe('GET /api/users/all', () => {
        it('Deve retornar um Array com todos os Usuário', done => {
            request(app)
                .get('/api/users/all')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK);
                    expect(res.body.payload).to.be.an('array');
                    expect(res.body.payload[0].name).to.be.equal(userDefualt.name);
                    expect(res.body.payload[0].email).to.be.equal(userDefualt.email);
                    done(error);
                });
        });
    })

    describe('GET /api/users/:id', () => {
        it('Deve retonar JSON com apenas o Usuário', done => {
            request(app)
                .get(`/api/users/${userDefualt.id}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK);
                    expect(res.body.payload.id).to.equal(userDefualt.id);
                    expect(res.body.payload).to.have.all.keys([
                        'id', 'name', 'email', 'password'
                    ]);
                    id = res.body.payload.id;
                    done(error);
                });
        });
    });

    describe('POST /api/users/create', () => {
        it('Deve criar Usuário', done => {
            const user = { 
                id: 9,
                name: 'Usuario Teste' ,
                email: 'usuario@email.com',
                password: 'novouser'
            };
            request(app)
                .post('/api/users/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(user)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK);
                    expect(res.body.payload.id).to.eql(user.id);
                    expect(res.body.payload.name).to.eql(user.name);
                    expect(res.body.payload.email).to.eql(user.email);
                    done(error);
                });
        });
    });

    describe('PUT /api/users/:id/update', () => {
        it('Deve atualizar Usuário', done => {
            const user = { 
                name: 'TestUpdate' ,
                email: 'update@email.com.br'
            };
            request(app)
                .put(`/api/users/${id}/update`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(user)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK);
                    done(error);
                });
        });
    });

    describe('DELETE /api/users/:id/destroy', () => {
        it('Deve deletar Usuário', done => {
            request(app)
                .del(`/api/users/${userTest.id}/destroy`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK);
                    done(error);
                });
        });
    });
});