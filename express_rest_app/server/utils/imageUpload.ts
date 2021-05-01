import path from 'path';
import fs from 'fs';

import { Request } from 'express';
import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: 'server/tmp/uploads',
  filename(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) {
    callback(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});
const imageUpload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export const clearImage = (filePath: string) => {
  if (!filePath) return;

  const fullPath = path.join(process.cwd(), filePath);

  fs.unlink(fullPath, (err) => (err ? console.log(err) : console.log(`file deleted: ${fullPath}`)));
};

export default imageUpload;
