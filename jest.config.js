/** @format */

module.exports = {
  setupFiles: ['./tests/setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testRegex: '.*\\.test\\.js$',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/components/**/*.{tsx}'],
  //必须要有，使用babel-jest编译test脚本
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  //序列化组件生成快照
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
