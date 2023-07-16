
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'tamln2',
  applicationName: 'serverless-todo',
  appUid: '6RPxwFVnNJs9t046ps',
  orgUid: '430e3a92-79ba-4e1a-85cd-7f3d8ebf8752',
  deploymentUid: '513500ce-6407-4afa-974d-17cd33e3dd2a',
  serviceName: 'serverless-todo',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'test',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '6.2.3',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'serverless-todo-test-GetTodos', timeout: 6 };

try {
  const userHandler = require('./src/lambda/http/getTodos.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}