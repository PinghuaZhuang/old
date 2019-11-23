const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const http = require("http"); 


/*
config.path 作废
*/
const config={
    // path:'/',
    // path:'/Users/wang/Desktop/git/luckyfivoucherweb/src/',
    // path:'D:/git/daimeng/',
    port:1024,
    savePathName:'save',//保存的路径名(当前项目下)
    notCatalog:{//过滤文件夹
        // '.git':true,
        'node_modules':true,
        'logs':true,
        'run':true,
    },
    format:{//匹配格式
        'vue':true,
        'js':true,
    }
},
cache={cnToEn:{}};//缓存数据


function getApp(req, res){
    const app={
        succesSend(data){//成功后返回数据
            res.send({
                code:200,
                data,
            });
        },
        errorSend(data){//失败返回数据
            res.send({
                code:404,
                data,
            });
        },
        isCatalog(path){//判断-目录
            path+='/';
            for(let name in config.notCatalog){
                if(path.indexOf('/'+name+'/')!=-1||path.indexOf('\\'+name+'\\')!=-1)return false;
            }
            return true;
        },
        regFormat:/[\S\s]+\./,
        isFormat(filePath){//判断-格式
            let format=filePath.replace(this.regFormat,'');
            if(config.format[format])return format;
            else return false;
        },
        readFile(filePath,format){//读取单个文件
            return new Promise((rev,err)=>{
                fs.readFile(filePath,function(error,data){
                    if(error)return err(error);
                    rev({
                        filePath,
                        format:format||filePath.replace(/[\S\s]+\./,''),
                        content:data.toString()
                    })
                })
            });
        },
        addFilePromise(filePath,format){//增加请求堆载
            if(!this.promisefileList)this.promisefileList=[];
            // if(this.promisefileList.length>0)return;
            this.promisefileList.push(this.readFile(filePath,format));
        },
        eachFile(){// 遍历目录下所有匹配文件
            return new Promise((rev,err)=>{
                function readDirSync(path){
                    if(app.isCatalog(path)==false)return;//过滤文件夹

                    try{
                        var pa = fs.readdirSync(path);
                        pa.forEach(function(ele,index){
                            var info = fs.statSync(path+"/"+ele)	
                            if(info.isDirectory()){
                                console.log("dir: "+ele)
                                readDirSync(path+"/"+ele);
                            }else{
                                let format=app.isFormat(ele);
                                if(format==false)return;
                                let filePath=path+"/"+ele;
                                console.log("file: "+ele)
                                app.addFilePromise(filePath,format);
                            }	
                        })
                    }catch(e){
                        app.errorSend({msg:'未找到当前路径哦~'});
                        err();
                    }
                }
                readDirSync(config.path);
                rev();
            })
        },
        saveFile(path, content){//保存单个文件到指定目录
            return new Promise((rev,err)=>{
                let lastPath = path.substring(0, path.lastIndexOf("/"));
                fs.mkdir(lastPath, {recursive: true}, (error) => {
                    if (error) return err(error);
                    fs.writeFile(path, content, function(error){
                        if (error) return err(error);
                        rev(true);
                    });
                });
            });
        },
        setConfig(param){//插入配置文件
            if(param.config){//来自前台主动配置
                for(let x in param.config){//遍历配置值
                    config[x]=param.config[x];
                }
                if(config.savePathName[config.savePathName.length-1]!='/'){
                    config.savePathName+='/';
                }
                console.log('保存路径：',param.config,config.savePathName);
            }
        },
        async getFileData(param){//获取所有文件列表
            await this.eachFile();//等待文件获取完毕
            return await Promise.all(app.promisefileList);
        },
        async saveFileList(list){//保存文件列表
            let promiseArr=[];
            list.forEach((t,i)=>{

                //window下路径转换
                t.filePath=t.filePath.replace(/\\/g,'/');
                
                let filePath=config.savePathName+t.filePath.replace(config.path,'');
                promiseArr.push(this.saveFile(filePath,t.content));
            })
            return await Promise.all(promiseArr);
        },
        cnToEn(word){
            return new Promise((rev,err)=>{
                if(cache.cnToEn[word])return rev(cache.cnToEn[word]);//存在缓存数据

                var options={  
                        host:"fy.iciba.com",                   
                        path:"/ajax.php?a=fy&f=auto&t=auto&w="+encodeURIComponent(word),
                        method:'get'
                    }  
                var sendmsg='';//创建空字符串，用来存放收到的数据

                req=http.request(options, function(req) {//发出请求，加上参数，然后有回调函数
                    req.on("data", function(chunk) {//监听data,接受数据
                        sendmsg += chunk;//把接受的数据存入定放的sendmsg
                    });
                    req.on("end", function(d) {//监听end事件，请求结束后调用
                        try{
                            var list=JSON.parse(sendmsg);//对接受到的数据流进行编码
                            // console.log(list);
                            rev(cache.cnToEn[word]={en:list.content.out,cn:word})//返回结果
                        }catch(e){err();}
                    });
                    
                }).on('error', function(e) {
                    err(e);
                })  
                req.end();
            })
        },
        async funGo({param, res}){
            // console.log('执行函数',param.fun);
            this.setConfig(param);//事先设置来自前台的配置
            switch(param.fun){
                case 'getFileData'://获取文件列表数据
                    console.log('文件开始读取')
                    try{
                        var data=await app.getFileData(param);
                        console.log('堆载文件总数量',app.promisefileList.length);
                        console.log('成功获取文件数量',data.length);
                        app.succesSend(data);
                    }catch(e){
                        console.log('获取文件列表出错',e);
                        app.errorSend({msg:'获取文件列表出错'})
                    }
                break;
                case 'saveFileList'://保存文件列表
                    console.log('开始保存文件');
                    try{
                        for(let x in param.lng){//加入语言包
                            param.fileList.push({
                                filePath:'language/'+x+'.json',
                                content:param.lng[x]
                            })
                        }
                        var data=await app.saveFileList(param.fileList);
                        app.succesSend({msg:'保存成功，当前路径下：'+config.savePathName});
                    }catch(e){
                        console.log(e);
                        app.errorSend({msg:'保存出错了~'});
                    }
                break;
                case 'cnToEn'://翻译代理接口
                    try{
                        var data=await app.cnToEn(param.word);
                        app.succesSend(data);
                    }catch(e){
                        console.log('翻译接口出错',e);
                        res.send({en:'翻译接口出错，这个字段请手动翻译吧',cn:param.word});

                        app.succesSend({en:'翻译接口出错，这个字段请手动翻译吧',cn:param.word});
                    }
                break;
            }
        }
    }
    return app;
}


(function(){//创建服务
    let ex=express();
    
    ex.use(bodyParser.json({limit: '500mb'}));
    ex.use(bodyParser.urlencoded({limit:'500mb',extended:true}));

    ex.use(express.static(path.join(__dirname, 'view')));//静态地址
    ex.get('/api',async function(req, res) {
        let app=getApp(req, res);
        app.funGo({param:req.query,res});
    }).post('/api',async function(req, res){
        let app=getApp(req, res);
        app.funGo({param:{...req.query,...req.body},res});
    }).listen(config.port);
    console.log(`http://localhost:${config.port}/index.html`);
})()