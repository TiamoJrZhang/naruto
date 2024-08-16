const path = require('path')
const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const {transformFromAst} = require('@babel/core')
const resolve = require('enhanced-resolve')
const appDirectory = fs.realpathSync(process.cwd())

const options = {
  entry: './index.tsx',
  output: {
    path: path.resolve(appDirectory, './dist'),
    filename: 'main.js',
  },
}

const utils = {
  getAst: path => {
    const content = fs.readFileSync(path, 'utf-8')
    return parser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    })
  },

  getDependencies: (ast, curFilePath) => {
    const dependencies = {}
    traverse(ast, {
      ImportDeclaration({node}) {
        const {value} = node.source
        const dirname = path.dirname(curFilePath)
        const resolver = resolve.create.sync({
          extensions: ['.tsx', '.jsx', '.ts', '.js'],
        })
        const filePath = resolver(dirname, value)
        dependencies[value] = filePath
      },
    })
    return dependencies
  },

  getCode: ast => {
    const {code} = transformFromAst(ast, null, {
      presets: ['@babel/preset-env'],
    })

    return code
  },
}

class Compiler {
  constructor(options) {
    const {entry, output} = options
    this.entry = path.resolve(appDirectory, entry)
    this.output = output
    this.modules = []
  }

  //构建启动
  run() {
    const info = this.build(this.entry)
    this.modules.push(info)
    this.modules.forEach(item => {
      const {dependencies} = item
      Object.keys(dependencies).forEach(v => {
        if (v) {
          this.modules.push(this.build(dependencies[v]))
        }
      })
    })
    const graph = this.modules.reduce((end, cur) => {
      return {
        ...end,
        [cur.fileName]: {
          dependencies: cur.dependencies,
          code: cur.code,
        },
      }
    }, {})
    this.generate(graph)
  }

  build(curFilePath) {
    //首先需要将源码转换成ast抽象语法树
    const ast = utils.getAst(curFilePath)
    const dependencies = utils.getDependencies(ast, curFilePath)
    const code = utils.getCode(ast)
    return {
      fileName: curFilePath,
      dependencies,
      code,
    }
  }

  //重写require函数
  generate(graph) {
    // 输出文件路径
    const filePath = path.join(this.output.path, this.output.filename)
    const bundle = `(function(graph) {
      function require(module) {        
        function localRequire(relativePath) {          
          return require(graph[module].dependecies[relativePath])        
        }        
        var exports = {};        
        (function(require,exports,code) {          
          eval(code)        
        })(localRequire,exports,graph[module].code);        
        return exports;      
      }      
      require('${this.entry}')    
    })(${JSON.stringify(graph)})`
    // 把文件内容写入到文件系统
    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
}

new Compiler(options).run()
