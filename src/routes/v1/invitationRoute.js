import express from 'express';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { invitationValidation } from '~/validations/invitationValidation';
import { invitationController } from '~/controllers/invitationController';

const Router = express.Router();

Router.route('/board')
  .post(authMiddleware.isAuthorized, invitationValidation.inviteUserToBoard, invitationController.inviteUserToBoard)
  .put(authMiddleware.isAuthorized, invitationValidation.updateBoardStatusInvitation, invitationController.updateBoardStatusInvitation);

Router.route('/')
  .get(authMiddleware.isAuthorized, invitationController.getInvitations);

export const invitationRoute = Router;