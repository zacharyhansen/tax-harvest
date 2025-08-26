import { SetMetadata } from '@nestjs/common';

/** No authentication required */
export const Public = () => SetMetadata('public', true);
