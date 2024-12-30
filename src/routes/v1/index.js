import express from 'express';
import { boardRoute } from './boardRoute';
import { columnRoute } from './columnRoute';
import { cardRoute } from './cardRoute';
import { userRoute } from './userRoute';
import { invitationRoute } from './invitationRoute';

const Router = express.Router();

Router.use('/boards', boardRoute);
Router.use('/columns', columnRoute);
Router.use('/cards', cardRoute);
Router.use('/users', userRoute);
Router.use('/invitations', invitationRoute);

export const APIs_V1 = Router;