import { CanActivateFn } from '@angular/router';

export const publicAccessGuard: CanActivateFn = (route, state) => {
  return true;
};
