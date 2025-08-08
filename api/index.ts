import serverless from 'serverless-http';
import app from '../server/src/index';

export default serverless(app);