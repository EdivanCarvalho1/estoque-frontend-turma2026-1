process.env.TS_NODE_PROJECT = 'tsconfig.app.json';

export default {
  paths: ['features/**/*.feature'],
  import: [
    'features/support/**/*.ts',
    'features/steps/**/*.ts'
  ],
  loader: ['ts-node/esm']
}
