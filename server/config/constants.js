// App-wide constants — avoids magic strings scattered throughout code

const ROLES = Object.freeze({
  ADMIN:  'admin',
  EDITOR: 'editor',
});

const INQUIRY_STATUS = Object.freeze({
  UNREAD:  'unread',
  READ:    'read',
  REPLIED: 'replied',
});

const PROJECT_STATUS = Object.freeze({
  DRAFT:     'draft',
  PUBLISHED: 'published',
});

const UPLOAD_FOLDERS = Object.freeze({
  THUMBNAILS:   'vickyvfx/thumbnails',
  VIDEOS:       'vickyvfx/videos',
  AVATARS:      'vickyvfx/avatars',
  SERVICES:     'vickyvfx/services',
  SITE_ASSETS:  'vickyvfx/site',
  BEFORE_AFTER: 'vickyvfx/before-after',
});

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];

const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 100;

module.exports = {
  ROLES,
  INQUIRY_STATUS,
  PROJECT_STATUS,
  UPLOAD_FOLDERS,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
};