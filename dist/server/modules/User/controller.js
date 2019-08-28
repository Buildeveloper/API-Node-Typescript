"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
var handlers_1 = require("./../../api/responses/handlers");
var _ = require("lodash");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.getAll = function (req, res) {
        service_1.default
            .getAll()
            .then(_.partial(handlers_1.default.onSuccess, res))
            .catch(_.partial(handlers_1.default.onError, res, "Erro ao buscar os usuarios"));
    };
    UserController.prototype.createUser = function (req, res) {
        service_1.default
            .create(req.body)
            .then(_.partial(handlers_1.default.onSuccess, res))
            .catch(_.partial(handlers_1.default.dbErrorHandler, res))
            .catch(_.partial(handlers_1.default.onError, res, 'Erro ao inserir um novo usuário'));
    };
    UserController.prototype.getById = function (req, res) {
        var userId = parseInt(req.params.id);
        service_1.default
            .getById(userId)
            .then(_.partial(handlers_1.default.onSuccess, res))
            .catch(_.partial(handlers_1.default.onError, res, "Usu\u00E1rio n\u00E3o encontrado"));
    };
    UserController.prototype.updateUser = function (req, res) {
        var userId = parseInt(req.params.id);
        var props = req.body;
        service_1.default
            .update(userId, props)
            .then(_.partial(handlers_1.default.onSuccess, res))
            .catch(_.partial(handlers_1.default.onError, res, "Falha ao atualizar usu\u00E1rio"));
    };
    UserController.prototype.deleteUser = function (req, res) {
        var userId = parseInt(req.params.id);
        service_1.default
            .delete(userId)
            .then(_.partial(handlers_1.default.onSuccess, res))
            .catch(_.partial(handlers_1.default.onError, res, "Erro ao excluir usuarios"));
    };
    return UserController;
}());
exports.default = new UserController();
