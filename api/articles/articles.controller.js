const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");

class ArticlesController {
    
  async create(req, res, next) {
    try {
      const articleData = {
        ...req.body,
        user: req.user._id 
      };
      const article = await articlesService.create(articleData);
      req.io.emit("articles:created", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("yout cannot update with this role, please try with admin role :)");
      }
      const article = await articlesService.update(req.params.id, req.body);
      req.io.emit("articles:updated", article);
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("yout cannot delete with this role, please try with admin role :)");
      }
      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("articles:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();