import { invitationService } from '~/services/invitationService';
import { StatusCodes } from 'http-status-codes';

const inviteUserToBoard = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id;
    const result = await invitationService.inviteUserToBoard(inviterId, req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getInvitations = async (req, res, next) => {
  try {
    const result = await invitationService.getInvitations(req.jwtDecoded._id);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const updateBoardStatusInvitation = async (req, res, next) => {
  try {
    const invitation = await invitationService.updateBoardStatusInvitation(req.body);
    res.status(StatusCodes.OK).json(invitation);
  } catch (error) {
    next(error);
  }
};

export const invitationController = {
  inviteUserToBoard,
  getInvitations,
  updateBoardStatusInvitation
};