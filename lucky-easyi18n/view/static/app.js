function getApp(newVue){
    const app={
        fileList:[],//获取的原始文件列表
        fileDomList:[],//被拆分后的文件
        cnConfig:{//默认拆分类型
            lable:1,
            attr:1,
            js:1,
        },
        regTemplate:/template/gi,
        // regCn:/<\S+?\s*([\u4e00-\u9fa5]+[\u4e00-\u9fa5\;\/\\\(\)\[\]:：《》（）；、，。!！\s]*)[\S\s]+?>/g,
        // regCn:/<[a-zA-Z\-_\d]+?[\s\S]*?([^<>{}"']*[\u4e00-\u9fa5]+[^<>{}"']*)[\S\s]*?>/g,

        //匹配带有中文的标签（粗糙匹配）
        lableCnRough:/<([a-z\d_\-]+)[^<>]*?>([^<>]*?[\u4e00-\u9fa5]+[\S\s]*?)<\/[a-z\d_\-]+[^<>]*?>/gi,
        //匹配带有中文属性值的标签（粗糙匹配）
        attrCnRough:/<([a-z\d_\-]+)[^<>]*?([^<>{}"'`]*[\u4e00-\u9fa5]+[^<>{}"'`]*)[^<>]*?>/gi,
        //匹配带有中文的js内容块（粗糙匹配）
        jsCnRough:/([^`'"\u4e00-\u9fa5]{0,20})[`"']+?([^`'"]*?[\u4e00-\u9fa5]+[^`'"]*?)[`"']+?[^`'"\u4e00-\u9fa5]{0,20}/gi,

        //匹配带有中文的标签（精细匹配）
        lableCnFine:/([<>{}"']*?[\s]*)([^\r\n<>\{\}"'`$]*[\u4e00-\u9fa5]+[^\r\n<>\{\}"'`$]*)([\s]*[<>{}"']*?)/gi,
        //匹配带有中文属性值的标签（精细匹配）
        attrCnFine:/([`"']+?)([^\r\n`'"]*?[\u4e00-\u9fa5]+[^\r\n`'"]*?)([`"']+?)/gi,
        //匹配带有中文的js内容块（精细匹配）
        jsCnFine:/([\{\}"'`$]+?)([^\r\n\{\}"'`$]*?[\u4e00-\u9fa5]+[^\r\n\{\}"'`$]*?)([\{\}"'`$]+?)/gi,
        // jsSymbolCnFine://gi,//js特殊符号运算

        notesReg:/<!--[\S\s]+?-->|\/\/[^\r\n]+|\/\*[\S\s]+?\*\//gi,//匹配注释
        notesSet:/\[only_(notes\d+?)\]/gi,//恢复注释正则
        notesList:{},//存储注释列表信息

        addValInt:0,
        get only(){//获取唯一值
            if(this.addValInt>9999)this.addValInt=0;
            return Date.now().toString().slice(3)+(this.addValInt++).toString().padStart(4,'0');
        },
        getOnly(prefix=''){//获取唯一标记值
            return prefix+this.only;
        },
        getOnlyReg({before='',only,after='',g='i'}){//获取查询匹配位置正则
            return new RegExp(`${before}(\\[only_${only}\\])${after}`,g);
        },
        getOnlyWrite(only){
            return '[only_'+only+']';
        },
        getI18:{//根据项目类型返回写法
            vue({d3,fieldName,d2}){
                fieldName=fieldName||'字段名';
                switch(d3.type){
                    case 'js':
                        if(d3.s1=='`'||d3.s1=='}'){
                            return d3.s1+"${this.$t('"+fieldName+"')}"+d3.s3;
                        }
                        return `this.$t('${fieldName}')`;
                    break;
                    case 'attr':
                        if(d2){//精细替换，避免格式写法错误
                            let reg=app.getOnlyReg({
                                before:'([^\'"{}\\s=]+=[^=]*?)',
                                only:d3.only
                            })
                            
                            d2.contentI18=d2.contentI18.replace(reg,(s,s1,s2)=>{//不一定能匹配到，匹配到的进行判断，无法匹配到的证明属性内出现等于号视为前面已经加入分号，无需再次执行
                                if(
                                    s[0]!=':'&&//vue属性写法
                                    s[0]!='@'&&//vue事件写法
                                    s.slice(0,2)!='v-'//vue逻辑写法
                                ){
                                    return `:${s1}"${s2}"`;//设置attr的vue写法、补充之前被吃的引号
                                }
                                else return s;
                            })
                        }
                        return "$t('"+fieldName+"')";
                    break;
                    case 'lable':
                        let defaultI18="{{ $t('"+fieldName+"') }}";
                        if(d2){//精细替换，避免格式写法错误
                            let reg=app.getOnlyReg({
                                before:'({{)([^>]*?)',
                                after:'([^<]*?)(}})',
                                only:d3.only
                            })
                            d2.contentI18=d2.contentI18.replace(reg,(s,s1,s2,s3,s4,s5)=>{
                                let s2match=s2.match(/`/g);
                                if(s2match&&s2match.length%2==1){//处于特殊的标记js字符串中
                                    defaultI18="${$t('"+fieldName+"')}";
                                }
                                else{
                                    let reg1=app.getOnlyReg({
                                        before:'(["\'])([\S\s]*?)',
                                        after:'([\S\s]*?)(["\'])',
                                        only:d3.only
                                    });
    
                                    s=s.replace(reg1,(a,a1,a2,a3,a4,a5)=>{
                                        let str='';
                                        if(a2.length){//中文前存在其他字符
                                            str+=`${a1}${a2}${a1}+`;//包裹中文前字符
                                        }
                                        str+=a3;
                                        if(a4.length){//中文后存在其他字符
                                            str+=`+${a5}${a4}${a5}`;//包裹中文后字符
                                        }
                                        return str;
                                    })
                                    defaultI18="$t('"+fieldName+"')";
                                }
                                return s;
                            })
                        }
                        return defaultI18;
                    break;
                }
            },
            react({d2,d3,fieldName}){
                fieldName=fieldName||'字段名';
                switch(d3.type){
                    case 'js':
                        if(d3.s1=='`'||d3.s1=='}'){
                            return d3.s1+"${this.props.t('"+fieldName+"')}"+d3.s3;
                        }
                        return `this.props.t('${fieldName}')`;
                    break;
                    case 'attr':
                        return `{this.props.t('${fieldName}')}`;
                    break;
                    case 'lable':
                        let defaultI18=`{this.props.t('${fieldName}')}`;
                        if(d2){//精细替换，避免格式写法错误
                            let reg=app.getOnlyReg({
                                before:'({)([^>{}]*?)',
                                after:'([^<{}]*?)(})',
                                only:d3.only
                            })
                            d2.contentI18=d2.contentI18.replace(reg,(s,s1,s2,s3,s4,s5)=>{
                                let s2match=s2.match(/`/g);
                                if(s2match&&s2match.length%2==1){//处于特殊的标记js字符串中
                                    defaultI18="${this.props.t('"+fieldName+"')}";
                                }
                                else{//在js逻辑中
                                    let reg1=app.getOnlyReg({
                                        before:'(["\'])([\S\s]*?)',
                                        after:'([\S\s]*?)(["\'])',
                                        only:d3.only
                                    });
    
                                    s=s.replace(reg1,(a,a1,a2,a3,a4,a5)=>{
                                        let str='';
                                        if(a2.length){//中文前存在其他字符
                                            str+=`${a1}${a2}${a1}+`;//包裹中文前字符
                                        }
                                        str+=a3;
                                        if(a4.length){//中文后存在其他字符
                                            str+=`+${a5}${a4}${a5}`;//包裹中文后字符
                                        }
                                        return str;
                                    })
                                    defaultI18="this.props.t('"+fieldName+"')";
                                }
                                return s;
                            })
                        }
                        return defaultI18;
                    break;
                }
            },
        },
        each(data,back){
            for(let x in data){
                if(back(data[x],x)===false)break;
            }
            return data;
        },
        setJsonVal(json,nameAll,val,isReplace=false){//json插入对应值
            if(!nameAll)return {error:'请输入字段名'};
            let nameList=nameAll.split('.'),error=false;
            app.each(nameList,(name,index)=>{
                if(name==''){
                    error='字段名错误：'+nameAll;
                    return false;
                }
                if(json[name]){
                    if(typeof json[name]=='object'){
                        json=json[name];
                    }
                    else if(isReplace===false){//已存在值为字符串的翻译，报错
                        error=`存在相同字段，完整字段名：${nameAll}、发现冲突时的名称：${name}、中文值：${val}`;
                        return false;
                    }
                }
                else if(index<nameList.length-1){
                    json=json[name]={};
                }
                else{//最终插入值
                    json[name]=val;
                    return false;
                }
            });
            return {error};
        },
        loadShow(msg=''){
            newVue.loadingMsg=msg;
            if(!this.showLoadNum){
                this.showLoadNum=1;
                newVue.loadingClass='show';
            }
            else this.showLoadNum++;//记录显示堆载数量
        },
        loadHide(){
            this.showLoadNum--;
            if(this.showLoadNum<=0){
                newVue.loadingClass='';

                if(this.loadEndFun){//触发load结束事件
                    this.each(this.loadEndFun,t=>{
                        t();
                    });
                    delete this.loadEndFun;
                }
            }
        },
        loadEnd(addFun){//load全部结束后执行事件
            if(!this.loadEndFun)this.loadEndFun=[];
            if(addFun)this.loadEndFun.push(addFun);
        },
        ajax({url,type='get',msg='',data,loading=true,loadingDelay=0}){
            if(loading){
                this.loadShow(msg);
            }
            return new Promise((rev,err)=>{
                $.ajax({
                    url,
                    type,
                    data,
                    success(d){
                        if(loading){
                            if(loadingDelay)setTimeout(r=>app.loadHide(),loadingDelay);//延迟关闭加载中
                            else app.loadHide();
                        }
                        if(d.code!=200)app.alert(d.data.msg);
                        else rev(d.data);
                    },
                    error(d){
                        if(loading)app.loadHide();
                        err(d);
                    },
                })
            })
        },
        alert(text,type='error'){//消息弹窗
            newVue.msg={
                text,
                show:'show '+type,
            };
            clearTimeout(newVue.alertTimeKey);
            newVue.alertTimeKey=setTimeout(()=>{
                newVue.$set(newVue.msg,'show',type);
            },3000);
        },
        confirmHide(){//关闭询问弹窗
            newVue.$set(newVue.confirm,'show','');
        },
        confirm(text,yes,not){//打开询问框
            newVue.confirm={
                text,
                show:'show',
                yes(){
                    yes&&yes();
                    app.confirmHide();
                },
                not(){
                    not&&not();
                    app.confirmHide();
                },
            };
        }
    };
    return app;
}
