import { environment as devEnvironment } from './environment.development';
import { environment as prodEnvironment } from './environment.production';

const mode = import.meta.env.VITE_APP_ENV;

const isProduction = mode === 'production';

export const environment = isProduction ? prodEnvironment : devEnvironment;
