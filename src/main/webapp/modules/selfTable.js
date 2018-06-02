
import React  from 'react'
import CommonSet from './commonTable'
import Detail from'./detail'
import ReactQuill from 'react-quill'
import { hashHistory } from 'react-router'
var Wrong=React.createClass(
    {
        displayName: 'Wrong',
        headers:["no","name","tags","frequency","date"],
        toolbarOptions:[
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            ['link', 'image'],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['formula'],
            ['clean']                                         // remove formatting button
        ],

        getInitialState:function() {
            return {
                data: null,
                dataCom:null,
                sortby: null,
                descending: false,
                edit: null, // [row index, cell index],
                search: false,
                login:false,
                register:false,
                user:null,
                loginPattern:1,
                registerPattern:1,
                logoutPattern:1,
                tagPattern:0,
                delete:false,
                detail:false,

                tags:[],
                addTagOne:"",
                addTagTwo:"",
                self:false,
                common:false,
                detailCom:false,
                addText:null,
            };
        },


        queryQuestion:function(){
            this.serverRequest=$.get('queryUserLibraries',function(data){

                var temp=JSON.parse(data);
                if (temp[0][0]==="-1"){
                    temp=null;
                }
                this.setState({
                    data:temp,
                    detail:false,
                    self:true,
                    common:false
                });

            }.bind(this));
        },

        queryManQuestion: function(){
            this.setState({
                detail:false,
                self:false,
                common:true
            });

        },

        sortTuple:function(e){
            var column = e.target.cellIndex;
            var data = this.state.data.slice();
            var descending = this.state.sortby === column && !this.state.descending;
            data.sort(function(a, b) {
                return descending
                    ? (a[column] < b[column] ? 1 : -1)
                    : (a[column] > b[column] ? 1 : -1);
            });
            this.setState({
                data: data,
                sortby: column,
                descending: descending,
                text:""
            });
        },

        showEditor: function(e) {
            if (this.state.data[e.target.dataset.row][5]===this.state.user[0]){
                this.setState({edit: {
                        row: parseInt(e.target.dataset.row),
                        cell: e.target.cellIndex,
                    }});
            }
        },

        saveEditor: function(e) {
            e.preventDefault();


            //MnpltServlet?add=1/0&delete=1/0&update=1/0&key=&name=&content=&reference=&tagOne=&tagTwo=&frequency=1/0&date=1/0
            if (this.state.edit.cell===1) {
                var input = e.target.firstChild;
                var data = this.state.data.slice();
                data[this.state.edit.row][this.state.edit.cell] = input.value;
                let info={
                    libraryId:data[this.state.edit.row][0],
                    name:input.value
                };
                this.serverRequest5 = $.post('updateQuestions',info, function (data) {

                }.bind(this));
                this.setState({
                    edit: null,
                    data: data,});
            }
            else if (this.state.edit.cell===2){
                var input = e.target.firstChild;
                var data = this.state.data.slice();
                if (this.state.tagPattern===0){
                    var temp=data[this.state.edit.row][this.state.edit.cell];
                    var i=temp.indexOf(" ");
                    var s=temp.substring(i);
                    data[this.state.edit.row][this.state.edit.cell]=input.value+s;
                    let info={
                        libraryId:data[this.state.edit.row][0],
                        tagOne:input.value
                    };

                    this.serverRequest5 = $.post('updateLibraries',info, function (data) {
                    }.bind(this));
                    this.setState({
                        edit: null,
                        data: data,
                        tagPattern:1
                    });
                }
                else{
                    var temp=data[this.state.edit.row][this.state.edit.cell];
                    var i=temp.indexOf(" ");
                    var s=temp.substring(0,i+1);
                    data[this.state.edit.row][this.state.edit.cell]=s+input.value;
                    let info={
                        libraryId:data[this.state.edit.row][0],
                        tagTwo:input.value
                    };
                    this.serverRequest5 = $.post('updateLibraries',info, function (data) {
                    }.bind(this));
                    this.setState({
                        edit: null,
                        data: data,
                        tagPattern:0
                    });
                }
            }
        },

        preData: null,

        searchPattern:function() {
            if (this.state.search) {
                this.setState({
                    data: this.preData,
                    search: false,
                });
                this.preData = null;
            } else {
                this.preData = this.state.data;
                this.setState({
                    search: true,
                });
            }
        },

        searchFilter: function(e) {
            var keyWord = e.target.value.toLowerCase();
            if (!keyWord) {
                this.setState({data: this.preData});
                return;
            }
            var idx = e.target.dataset.idx;
            var searchdata = this.preData.filter(function(row) {
                return row[idx].toString().toLowerCase().indexOf(keyWord) > -1;
            });
            this.setState({data: searchdata});
        },

        //login

        loginId:null,
        loginPwd:null,

        saveLoginId: function(e){
            this.loginId=e.target.value;
        },

        saveLoginPwd: function(e){
            this.loginPwd=e.target.value;
        },

        saveLogin: function(){
            let info={
                id:this.loginId,
                password:this.loginPwd
            };
            this.serverRequest2=$.post('login',info
                ,function(data){
                    var user=JSON.parse(data);;
                    if (user[0]==="-1"){
                        this.setState({
                            loginPattern:3
                        })
                    }
                    else if (user[0]==="0"){
                        this.setState({
                            loginPattern:2
                        })
                    }
                    else{
                        this.setState({
                            user:user,
                            login:true,
                            loginPattern:0
                        });
                       // hashHistory.push("/yourset/"+user[0]);
                    }
                    //this.queryQuestion();
                }.bind(this));
        },

        changePatternLogin: function(){
            this.setState({
                loginPattern:1
            });
        },

        handleCloseLogin2:function(){
            var pop=document.getElementById("poplogin");
            pop.style.display="none";
            this.setState({
                loginPattern:1
            });
            hashHistory.push("/yourset/"+this.state.user[0]);
        },

        handleCloseLogin: function(){
            var pop=document.getElementById("poplogin");
            pop.style.display="none";
            this.setState({
                loginPattern:1
            });
        },

        login: function(){
            var pop=document.getElementById("poplogin");
            pop.style.display="block";
        },

        //register

        registerName:null,
        registerPwd:null,
        registerPwdCp:null,
        registerEmail:null,
        registerPhone:null,
        registerId:null,

        saveRegisterName: function(e){
            this.registerName=e.target.value;
            let name=this.registerName;
            if (name.length > 10){
                var pop=document.getElementById("usernamehint");
                pop.style.display="block";
            }
            else{
                var pop=document.getElementById("usernamehint");
                pop.style.display="none";
            }
        },

        saveRegisterPwd: function(e){
            this.registerPwd=e.target.value;
            let password=this.registerPwd;
            let p1=/[0-9]/;
            let p2=/[a-zA-Z]/i;
            if (password.length >=6 && p1.test(password) && p2.test(password) ){
                var pop=document.getElementById("passwordhint");
                pop.style.display="none";
            }
            else{
                var pop=document.getElementById("passwordhint");
                pop.style.display="block";
            }
        },

        saveRegisterPwdCp: function(e){
            this.registerPwdCp=e.target.value;
            if (this.registerPwd === this.registerPwdCp){
                var pop=document.getElementById("passwordcphint");
                pop.style.display="none";
            }
            else{
                var pop=document.getElementById("passwordcphint");
                pop.style.display="block";
            }
        },

        saveRegisterEmail: function(e){
            this.registerEmail=e.target.value;
            let email=this.registerEmail;
            if (email.indexOf("@") !== -1 && (email.indexOf(".com") !== -1 || email.indexOf(".cn") !== -1)){
                var pop=document.getElementById("useremailhint");
                pop.style.display="none";
            }
            else{
                var pop=document.getElementById("useremailhint");
                pop.style.display="block";
            }
        },

        saveRegisterPhone: function(e){
            this.registerPhone=e.target.value;
            let phone=this.registerPhone;
            let p=/^\+?[1-9][0-9]*$/;
            if (phone.length !== 11 || !p.test(phone)){
                var pop=document.getElementById("userphonehint");
                pop.style.display="block";
            }
            else{
                var pop=document.getElementById("userphonehint");
                pop.style.display="none";
            }
        },

        saveRegister: function(e){
            /*this.serverRequest3=$.get("/RegisterServlet?username="+this.registerName+"&password="+this.registerPwd
                +"&email="+this.registerEmail+"&phone="+this.registerPhone
                ,function(data){
                    var user=JSON.parse(data);
                    if (user[0]==="0"){
                        this.setState({
                            registerPattern:2
                        })
                    }
                    else{
                        this.registerId=user[0];
                        this.setState({
                            registerPattern:0,
                        });
                    }
                }.bind(this));*/
            let info={
                username:this.registerName,
                password:this.registerPwd,
                email:this.registerEmail,
                phone:this.registerPhone
            };
            this.serverRequest3=$.ajax({
                    type:'POST',
                    url:'register',
                    data:info,
                    success:function(data){
                        var user=JSON.parse(data);
                        if (user[0]==="0"){
                            this.setState({
                                registerPattern:2
                            })
                        }
                        else{
                            this.registerId=user[0];
                            this.setState({
                                registerPattern:0,
                            });
                        }
                    }.bind(this)});
        },

        changePatternRegister: function(){
            this.setState({
                registerPattern:1
            });
        },

        handleCloseRegister: function(){
            var pop=document.getElementById("popregister");
            pop.style.display="none";
            this.setState({
                registerPattern:1
            });
        },

        register: function(){
            var pop=document.getElementById("popregister");
            pop.style.display="block";
        },





        render: function() {
            return (
                <div>
                    <div>
                        {this.renderToolbar()}
                        {this.renderTable()}
                        {this.renderPopLogin()}
                        {this.renderPopRegister()}
                    </div>
                </div>
            );
        },

        renderPopLogin: function(){
            if (this.state.loginPattern===1) {
                return (
                    <div id="poplogin">
                        <form>
                            <p>id: <input type="text" name="id" onChange={this.saveLoginId}/></p>
                            <p>password: <input type="password" name="password" onChange={this.saveLoginPwd}/>
                            </p>
                            <input type="button" value="submit" onClick={this.saveLogin}/>
                        </form>
                        <button className="close" onClick={this.handleCloseLogin}>close</button>
                    </div>
                )
            }
            else if (this.state.loginPattern===2){
                return(
                    <div id="poplogin">
                        <p>wrong password</p>
                        <button onClick={this.changePatternLogin}>try again</button>
                        <button className="close" onClick={this.handleCloseLogin}>close</button>
                    </div>
                )
            }
            else if (this.state.loginPattern===0){
                return(
                    <div id="poplogin">
                        <p>hi,{this.state.user[1]}</p>
                        <button className="close" onClick={this.handleCloseLogin2}>close</button>
                    </div>
                )
            }
            else{
                return(
                    <div id="poplogin">
                        <p>userid no existence</p>
                        <button onClick={this.changePatternLogin}>try again</button>
                        <button className="close" onClick={this.handleCloseLogin}>close</button>
                    </div>
                )
            }
        },

        renderPopRegister: function(){
            if (this.state.registerPattern===1){
                return(
                    <div id="popregister">
                        <form>
                            <p>username: <input type="text" name="username" onChange={this.saveRegisterName}/></p>
                            <p id="usernamehint">最多10个字</p>
                            <p>password: <input type="password" name="password" onChange={this.saveRegisterPwd}/></p>
                            <p id="passwordhint">字母数字混合，最少6位</p>
                            <p>password: <input type="password" name="password" onChange={this.saveRegisterPwdCp}/></p>
                            <p id="passwordcphint">两次密码不一致</p>
                            <p>email: <input type="text" name="email" onChange={this.saveRegisterEmail}/></p>
                            <p id="useremailhint">邮件格式不正确</p>
                            <p>phone number: <input type="text" name="phone" onChange={this.saveRegisterPhone}/></p>
                            <p id="userphonehint">11位手机号</p>
                            <input type="button" value="submit" onClick={this.saveRegister}/>
                        </form>
                        <button className="close" onClick={this.handleCloseRegister}>close</button>
                    </div>
                )
            }
            else if (this.state.registerPattern===0){
                return(
                    <div id="popregister">
                        <p>success,your id is {this.registerId}.</p>
                        <button className="close" onClick={this.handleCloseRegister}>close</button>
                    </div>
                )
            }
            else {
                return (
                    <div id="popregister">
                        <p>phone has been used</p>
                        <button onClick={this.changePatternRegister}>try again</button>
                        <button className="close" onClick={this.handleCloseRegister}>close</button>
                    </div>
                );
            }
        },


        renderToolbar: function(){
            return (
                <div>
                    <div className="Toolbar">
                        <button onClick={this.queryManQuestion}>Popular Wrong Set</button>
                        <button onClick={this.queryQuestion}>My Wrong Set</button>
                    </div>
                    {this.renderLogin()}
                </div>

            )
        },



        renderLogin: function(){

                return (
                    <div className="Userbar">
                        <button id="loginbtn" onClick={this.login}>Login</button>
                        <button id="registerbtn" onClick={this.register}>Register</button>
                    </div>
                )

        },





        renderTable: function(){

                if (this.state.self)
                {return (<p id="loginHint">please log in</p>);}
                else if (this.state.common){
                    return (<CommonSet/>)
                }
        },


    }


);

//headers={this.props.headers} initialData={this.state.dataCom}


export default Wrong;
