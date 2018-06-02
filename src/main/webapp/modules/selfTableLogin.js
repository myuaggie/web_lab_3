
import React  from 'react'
import CommonSet from './commonTable'
import Detail from'./detail'
import ReactQuill from 'react-quill'
import { hashHistory } from 'react-router'
var WrongLog=React.createClass(
    {
        displayName: 'WrongLog',
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
                login:true,
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

        componentWillMount:function(){
            this.serverRequest23=$.get('querySessionUser',function(data){
                var u=JSON.parse(data);
                this.setState({user:u});
            }.bind(this));
            this.queryQuestion();
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



        //logout

        saveLogout: function(){
            this.serverRequest4=$.get('logout',function(data){
                this.setState({
                    logoutPattern:0,
                    login:false,
                    record:false
                });
            }.bind(this));
        },

        handleCloseLogout: function(){
            var pop=document.getElementById("poplogout");
            pop.style.display="none";
            this.setState({
                logoutPattern:1
            });
        },

        logout: function(){
            var pop=document.getElementById("poplogout");
            pop.style.display="block";
        },

        //usercenter

        handleCloseCenter: function(){
            var pop=document.getElementById("popusercenter");
            pop.style.display="none";
        },

        userCenter: function(){
            var pop=document.getElementById("popusercenter");
            pop.style.display="block";
        },

        //add

        addName:"",
        addContent:"",
        addTagOne:"",
        addTagTwo:"",

        saveAddName: function(e){
            this.addName=e.target.value;
        },

        saveAddContent: function(value){
            this.addContent=value;
            this.setState({addText:value});
        },

        saveAddTagOne: function(e){
            this.addTagOne=e.target.value;
            this.setState({addTagOne:e.target.value});
        },

        saveAddTagTwo: function(e){
            this.addTagTwo=e.target.value;
            this.setState({addTagTwo:e.target.value});
        },
        // MnpltServlet?add=1/0&delete=1/0&update=1/0&key=&name=&content=&reference=&tagOne=&tagTwo=&frequency=1/0&date=1/0
        saveAdd: function(){
            var key=null;
            if(this.state.data.length===0){key=1;}
            else {
                key = parseInt(this.state.data[this.state.data.length - 1][0]) + 1;
            }
            let info={
                libraryId:key,
                name:this.addName,
                content:this.addContent,
                tagOne:this.addTagOne,
                tagTwo:this.addTagTwo
            };
            this.serverRequest6=$.post('addLibraries',info,function(data){
                var pop=document.getElementById("popadd");
                pop.style.display="none";
                this.addName="";
                this.addContent="";
                this.addTagOne="";
                this.addTagTwo="";
                this.setState({addTagOne:"",addTagTwo:"",addText:null});
                this.queryQuestion();
            }.bind(this));
        },



        handleCloseAdd:function(){
            var pop=document.getElementById("popadd");
            pop.style.display="none";
            this.addName="";
            this.addContent="";
            this.addTagOne="";
            this.addTagTwo="";
            var input=document.getElementById("questionname");
            input.value="";
            input=document.getElementById("questiontagone");
            input.value="";
            input=document.getElementById("questiontagtwo");
            input.value="";
            this.setState({addTagOne:"",addTagTwo:"",addText:""});
        },

        addQuestion: function(){
            var pop=document.getElementById("popadd");
            pop.style.display="block";
        },

        //delete

        showDelete: function(){
            if (!this.state.delete) {
                var pop = document.getElementsByClassName("delete");
                for (var i=0;i<pop.length;i++){
                    pop[i].style.color = "#a1263b";
                }
            }
            else{
                var pop = document.getElementsByClassName("delete");
                for (var i=0;i<pop.length;i++){pop[i].style.color = "#2589bf";}
            }
            this.setState({delete:!this.state.delete});
        },

        deleteQuestion: function(e){

            var id=e.target.id;
            var key=document.getElementById(id).innerHTML;
            let info={libraryId:key};
            this.serverRequest7=$.post('deleteLibraries',info,function(data){
                this.queryQuestion();
            }.bind(this));
        },

        //detail

        detailQuestion: function(e){
            var name=e.target.id;
            var k=name.indexOf("r");
            var id=name.substring(0,k)+"0";
            var key=document.getElementById(id).innerHTML;
            let info={libraryId:key};
            hashHistory.push("/detail/"+key);
            /*this.serverRequest8=$.post('queryDetails',info,function(data){
                var d=JSON.parse(data);
                this.setState({detail:true,self:false,detailData:d});
                //var c=document.getElementById("detailContent");
                //c.innerHTML=d[1];
            }.bind(this));*/
        },




        render: function() {
            return (
                <div>
                    <div>
                        {this.renderToolbar()}
                        {this.renderTable()}
                        {this.renderPopLogout()}
                        {this.renderPopUserCenter()}
                        {this.renderPopAdd()}
                    </div>
                </div>
            );
        },



        renderPopLogout: function(){
            if (this.state.logoutPattern===1){
                return(
                    <div id="poplogout">
                        <p>Are you sure to log out?</p>
                        <button onClick={this.saveLogout}>Yes</button>
                        <button onClick={this.handleCloseLogout}>No</button>
                    </div>
                )
            }
            else{
                return (
                    <div id="poplogout">
                        <p>success</p>
                        <button className="close" onClick={this.handleCloseLogout}>close</button>
                    </div>
                )
            }
        },

        renderPopUserCenter: function(){
            if (this.state.user) {
                return (
                    <div id="popusercenter">
                        <p>id: {this.state.user[0]}</p>
                        <p>name: {this.state.user[1]}</p>
                        <p>email: {this.state.user[2]}</p>
                        <p>phone: {this.state.user[3]}</p>
                        <button className="close" onClick={this.handleCloseCenter}>close</button>
                    </div>
                )
            }
        },

        renderPopAdd: function(){
            var ttemp=new Set();
            var list=[];
            var temp=this.state.data;
            if (temp) {
                var tag1, tag2;
                for (var i = 0; i < temp.length; i++) {
                    var str = temp[i][2];
                    var idx = str.indexOf(" ");
                    tag1 = str.substring(0, idx);
                    if (ttemp.has(tag1) === false) {
                        ttemp.add(tag1);
                        list.push(tag1);
                    }
                    if (idx !== length - 1) {

                        tag2 = str.substring(idx + 1);
                        if (ttemp.has(tag2) === false) {
                            ttemp.add(tag2);
                            list.push(tag2);
                        }
                    }
                }
            }
            let tagO=list.map(function(item) {
                if (item.indexOf(this.state.addTagOne) !== -1) return (<div className="tagHint" key={"1"+item}>{item}</div>)
            },this);
            let tagT=list.map(function(item) {
                if (item.indexOf(this.state.addTagTwo) !== -1) return (<div className="tagHint" key={"2"+item}>{item}</div>)
            },this);
            return(
                <div id="popadd">
                    <form>
                        <p>name: <input type="text" name="questionname" onChange={this.saveAddName}/></p>
                        <div >content: <ReactQuill id="questioncontent" modules={{ formula: true, toolbar:this.toolbarOptions}} style={{height:"200px"}} value={this.state.addText}
                                                   onChange={this.saveAddContent} /></div>
                        <p>tagone: <input type="text"  id="questiontagone" name="questiontagone" onChange={this.saveAddTagOne}/></p>
                        <div className="tag">{tagO}</div>
                        <p>tagtwo: <input type="text" id="questiontagtwo" name="questiontagtwo" onChange={this.saveAddTagTwo}/></p>
                        <div className="tag">{tagT}</div>
                        <input type="button" value="submit" onClick={this.saveAdd}/>
                    </form>
                    <button className="close" onClick={this.handleCloseAdd}>close</button>
                </div>
            )
        },


        renderToolbar: function(){
            return (
                <div>
                    <div className="Toolbar">
                        <button onClick={this.queryManQuestion}>Popular Wrong Set</button>
                        <button onClick={this.queryQuestion}>My Wrong Set</button>
                    </div>
                    {this.renderMnplt()}
                    {this.renderLogin()}
                </div>

            )
        },

        renderMnplt: function(){
            if (this.state.login && this.state.self){
                return (
                    <div className="Mnpltbar" >
                        <button onClick={this.searchPattern}>Search</button>
                        <button onClick={this.addQuestion}>Add</button>
                        <button onClick={this.showDelete}>Delete</button>
                    </div>)
            }
        },

        renderLogin: function(){

                return(
                    <div className="Userbar">
                        <button id="logoutbtn" onClick={this.logout}>Logout</button>
                        <button id="usercenterbtn" onClick={this.userCenter}>User Center</button>
                    </div>
                )

        },

        renderSearchTable: function(){
            if (!this.state.search) {
                return null;
            }
            return (
                <tr onChange={this.searchFilter}>
                    {this.headers.map(function(_ignore, idx) {
                        return <td key={idx}><input type="text" data-idx={idx}/></td>;
                    })}
                </tr>
            );
        },



        renderTable: function(){
            if (this.state.login) {
                if (this.state.self===true && this.state.data){
                    return (
                        <table>

                            <tbody onDoubleClick={this.showEditor}>
                            {this.renderSearchTable()}
                            <tr onClick={this.sortTuple}>
                                {this.headers.map(function (title, idx) {
                                    if (this.state.sortby === idx) {
                                        title += this.state.descending ? ' \u2191' : ' \u2193';
                                    }
                                    return (<th key={idx}>{title}</th>);
                                }, this)}
                            </tr>
                            {this.state.data.map(function (row, rowidx) {
                                return (
                                    <tr key={rowidx}>
                                        {row.map(function (cell, idx) {
                                            var content = cell;
                                            var edit = this.state.edit;
                                            //只允许修改name和tags
                                            if (edit && edit.row === rowidx && edit.cell === idx &&(idx===1||idx===2)) {
                                                if (idx===2){
                                                    var i=cell.indexOf(" ");
                                                    var tag1=cell.substring(0,i);
                                                    var tag2=cell.substring(i+1);
                                                    if (this.state.tagPattern===0) {
                                                        content = (

                                                                <form onSubmit={this.saveEditor}>
                                                                    <input type="text" defaultValue={tag1}/>
                                                                </form>

                                                        )
                                                    }
                                                    else{
                                                        content = (

                                                                <form onSubmit={this.saveEditor}>
                                                                    <input type="text" defaultValue={tag2}/>
                                                                </form>

                                                        )
                                                    }
                                                }
                                                else {
                                                    content = (
                                                        <form onSubmit={this.saveEditor}>
                                                            <input type="text" defaultValue={cell}/>
                                                        </form>
                                                    )
                                                }
                                            }
                                            if (idx===1){
                                                return <td className="detail"
                                                           id={"td" + rowidx.toString() + "r"+idx.toString()}
                                                           onClick={this.detailQuestion} key={idx}
                                                           data-row={rowidx}>{content}</td>
                                            }
                                            if (idx===0){
                                                if (this.state.delete===true) {
                                                    return <td className="delete"
                                                               id={"td" + rowidx.toString() + idx.toString()}
                                                               onClick={this.deleteQuestion} key={idx}
                                                               data-row={rowidx}>{content}</td>
                                                }
                                                else{
                                                    return <td className="delete"
                                                               id={"td" + rowidx.toString() + idx.toString()}
                                                               key={idx}
                                                               data-row={rowidx}>{content}</td>
                                                }
                                            }
                                            if (idx===5) return null;
                                            else {return <td key={idx} data-row={rowidx}>{content}</td>}
                                        }, this)}

                                    </tr>
                                );
                            }, this)}
                            </tbody>
                        </table>

                    );
                }
                /*else if (this.state.detail===true){
                    if (this.state.detailData){
                        return(
                            <Detail userData={this.state.user} initialData={this.state.detailData} toolbarOptions={this.toolbarOptions}/>
                        )
                    }
                }*/
                else if (this.state.common){
                    return (<CommonSet/>)
                }
            }
            else{
                hashHistory.push("/wrongset")
            }
        },


    }


);

//headers={this.props.headers} initialData={this.state.dataCom}


export default WrongLog;
