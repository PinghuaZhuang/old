# lucky-easyi18n

## 安装-最好先更新node到最新版本，避免出现没必要问题
cnpm install

## 运行
npm run dev
或 npm run start

## 操作界面
http://localhost:1024/index.html
1、填写要翻译的项目对应子目录（绝对路径）
2、选择项目内容

## 保存
1. 保证字段名不一致
2. 字段名使用 name1.name2 = {"name1":{"name2":value}}
3. 自动翻译不一定正确，手动修改

## 保存后
1. 保存路径：保存后地址为当前lucky-easyi18n下的save目录中的对应子文件夹
2. 语言包路径：为保存路径下的 language 目录下的中英文json