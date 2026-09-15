import { PRESET_ROLES } from '../prisma/seed.js';

export class RoleController {
  getRoles(req, res) {
    res.status(200).json({
      success: true,
      data: PRESET_ROLES,
      message: 'Available interview roles retrieved'
    });
  }
}

export const roleController = new RoleController();
