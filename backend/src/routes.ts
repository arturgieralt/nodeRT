import { Application } from 'express';
import * as ArticlesController from './controllers/ArticlesController';
import * as CommentsController from './controllers/CommentsController';
import * as UsersController from './controllers/UsersController';
import * as FilesController from './controllers/FilesController';
import { authorize } from './auth/authorize';

export class Routes {
  public routes(app: Application): void {
    app
      .route('/articles')
      .get(ArticlesController.getAll)
      .post(authorize(['Admin']), ArticlesController.add);
    app
      .route('/articles/:articleId')
      .get(ArticlesController.getSingle)
      .put(authorize(['Admin']), ArticlesController.update)
      .delete(authorize(['Admin']), ArticlesController.remove);

    app
      .route('/comments')
      .get(authorize(), CommentsController.getAll)
      .post(authorize(), CommentsController.add);
    app
      .route('/comments/:commentId')
      .get(authorize(), CommentsController.getSingle)
      .put(authorize(), CommentsController.update)
      .delete(authorize(), CommentsController.remove);

    app.route('/users').get(authorize(), UsersController.getAll);
    app.route('/register').post(UsersController.register);
    app.route('/login').post(UsersController.login);

    app
      .route('/users/:userId')
      .get(authorize(), UsersController.getSingle)
      .put(authorize(), UsersController.update)
      .delete(authorize(), UsersController.remove);

    app
      .route('/files')
      .get(authorize(['Admin']), FilesController.getAll)
      .post(
        authorize(['Admin']),
        FilesController.FILE_UPLOAD_SETTINGS,
        FilesController.upload
      );
    app
      .route('/files/:fileId')
      .get(authorize(['Admin']), FilesController.getSingle)
      .delete(authorize(['Admin']), FilesController.remove);
  }
}