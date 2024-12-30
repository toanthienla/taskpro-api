import env from '~/config/enviroment';

export const WHITELIST_DOMAINS = [
  // Taskpro domain hosting
  env.WEBSITE_DOMAIN_PRODUCTION
];

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
};

export const WEBSITE_DOMAIN = env.BUILD_MODE === 'dev' ? env.WEBSITE_DOMAIN_DEVELOPMENT : env.WEBSITE_DOMAIN_PRODUCTION;

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 12;

export const INVITATION_TYPES = {
  BOARD_INVITATION: 'board_invitation'
};
export const BOARD_INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};