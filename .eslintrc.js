module.exports = {
  parser: '@typescript-eslint/parser', //定义ESLint的解析器
  extends: [
    'prettier/@typescript-eslint', //使得@typescript-eslint中的样式规范失效，遵循prettier中的样式规范
    'plugin:prettier/recommended' //使用prettier中的样式规范，且如果使得ESLint会检测prettier的格式问题，同样将格式问题以error的形式抛出
  ], //定义文件继承的子规范
  plugins: [
    'react',
    '@typescript-eslint'
  ], //定义了该eslint文件所依赖的插件
  env: { //指定代码的运行环境
    browser: true,
    node: true,
  },
  settings: { //自动发现React的版本，从而进行规范react代码
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  }, 
  parserOptions: { //指定ESLint可以解析JSX语法
    "ecmaVersion": 2019,
    "sourceType": 'module',
    "ecmaFeatures":{
      jsx: true
    }
  },
  rules: {
    'no-unused-vars': 1,
    'no-useless-escape': 1
  }
}