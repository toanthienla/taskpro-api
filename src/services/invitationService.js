import { StatusCodes } from 'http-status-codes';
import { boardModel } from '~/models/boardModel';
import { invitationModel } from '~/models/invitationModel';
import { userModel } from '~/models/userModel';
import ApiError from '~/utils/ApiError';
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants';
import { pickUser } from '~/utils/formatters';

const inviteUserToBoard = async (inviterId, reqBody) => {
  const inviter = await userModel.findOneById(inviterId);
  const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail);
  const board = await boardModel.findOneById(reqBody.boardId);

  if (!inviter || !invitee) {
    throw new Error('Invite information is missing.');
  }
  if (!board) {
    throw new Error('Board information is missing.');
  }

  const invitationData = {
    inviterId: inviterId,
    inviteeId: invitee._id.toString(),
    type: INVITATION_TYPES.BOARD_INVITATION,
    boardInvitation: {
      boardId: board._id.toString(),
      status: BOARD_INVITATION_STATUS.PENDING
    }
  };

  const { insertedId } = await invitationModel.createInvitation(invitationData);
  const invitationResult = await invitationModel.findOneById(insertedId);

  return {
    ...invitationResult,
    inviter: pickUser(inviter),
    invitee: pickUser(invitee),
    board
  };
};

const getInvitations = async (userId) => {
  const resInvitations = await invitationModel.findManyByInviteeId(userId);

  // Change inviter, invitee, and board array 1 object to 1 object
  const invitations = resInvitations.map(i => ({
    ...i,
    inviter: i.inviter[0] || {},
    invitee: i.invitee[0] || {},
    board: i.board[0] || {}
  }));

  return invitations;
};

const updateBoardStatusInvitation = async (reqBody) => {
  const invitationId = reqBody.invitationId;
  const status = reqBody.status;

  // Check if the invitation exists
  const invitation = await invitationModel.findOneById(invitationId);
  if (!invitation) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found.');
  }

  // Check what board update status is
  const board = await boardModel.findOneById(invitation.boardInvitation.boardId);
  if (!board) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found.');
  }
  const boardOwnersAndMembers = board.ownerIds.concat(board.memberIds);

  // Status is accepted and the invitee is not a member of the board
  if (status === BOARD_INVITATION_STATUS.ACCEPTED) {
    if (!boardOwnersAndMembers.toString().includes(invitation.inviteeId.toString())) {
      board.memberIds.push(invitation.inviteeId);

      // Add the invitee to the board members
      const updateBoardData = {
        memberIds: board.memberIds,
        updatedAt: new Date()
      };
      if (updateBoardData) {
        await boardModel.updateBoard(board._id, updateBoardData);
      }
    } else {
      throw new ApiError(StatusCodes.CONFLICT, 'You are already a member of the board.');
    }
  }

  // Update invitation status
  const updateInvitationData = {
    boardInvitation: {
      ...invitation.boardInvitation,
      status: status
    },
    updatedAt: new Date()
  };
  return await invitationModel.updateInvitation(invitationId, updateInvitationData);
};

export const invitationService = {
  inviteUserToBoard,
  getInvitations,
  updateBoardStatusInvitation
};