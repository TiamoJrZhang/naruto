<!-- @format -->

搭建过程中遇到的问题

1. prettier --write 需要 node 版本 v10.13.0 以上版本，安装 lint-staged@9.0.0 prettier@1.19.1 后解决
2. ts 无法识别 webpack 别名，需配置 "paths": {"@/_": ["./src/_"]
