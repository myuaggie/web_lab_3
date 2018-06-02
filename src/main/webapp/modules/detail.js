import React, { Component }  from 'react'
import ReactQuill from 'react-quill'

var Detail= React.createClass({
    displayName: 'Detail',
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

    getInitialState: function() {
        return {
            detailData:null,
            user:null,
            showRef:false,
            text:null,
            record:false,
            recordData:[],
            refText:null,
            answer:null,
        };
    },

    componentWillMount: function(){
        let info={libraryId:this.props.params.key};
        this.serverRequest8=$.post('queryDetails',info,function(data){
                var d=JSON.parse(data);
                this.setState({detailData:d});
            }.bind(this));
        this.serverRequest22=$.get('querySessionUser',function(data){
            var u=JSON.parse(data);
            this.setState({user:u});
        }.bind(this));
    },

    componentWillReceiveProps: function(){
        let info={libraryId:this.props.params.key};
        this.serverRequest8=$.post('queryDetails',info,function(data){
            var d=JSON.parse(data);
            this.setState({detailData:d});
        }.bind(this));
        this.serverRequest22=$.get('querySessionUser',function(data){
            var u=JSON.parse(data);
            this.setState({user:u});
        }.bind(this));
    },

    showReference: function(){
        var ref=document.getElementById("reference");
        ref.style.display="block";
        this.setState({showRef:true});
        if (this.state.detailData[2]!==null){
            var reff=document.getElementById("refContent");
            reff.innerHTML=this.state.detailData[2];
        }
    },

    hideReference: function(){
        var ref=document.getElementById("reference");
        ref.style.display="none";
        this.setState({showRef:false});
    },

    ref:"",

    saveRef: function(value){
        this.ref=value;
        this.setState({refText:value});
    },

    saveUpdateRef: function(){
        let info={
            libraryId:this.state.detailData[5],
            reference:this.ref
        };
        this.serverRequest9 = $.post('updateQuestions',info, function (data) {
            var pop=document.getElementById("popref");
            pop.style.display="none";
            var temp=this.state.detailData;
            temp[2]=this.ref;
            this.setState({detailData:temp});
            var c=document.getElementById("refContent");
            c.innerHTML=this.ref;
        }.bind(this));
    },

    popRef: function(){
        var pop=document.getElementById("popref");
        pop.style.display="block";
    },

    handleCloseRef:function(){
        var pop=document.getElementById("popref");
        pop.style.display="none";
    },
    //editor

    handleChangeEditor: function(value){
        this.setState({text:value});
    },

    updateFre: function(){
        let info={
            libraryId:this.state.detailData[5],
            frequency:true
        };
        this.serverRequest11 = $.post('updateLibraries',info, function (data) {
        }.bind(this));
    },

    updateDate: function(){
        let info={
            libraryId:this.state.detailData[5],
            date:true
        };
        this.serverRequest12 = $.post('updateLibraries',info, function (data) {
        }.bind(this));
    },

    handleSubmitEditor: function(){
        var temp;
        let info={
            libraryId:this.state.detailData[5]
        };
        this.serverRequest16 = $.post('queryRecords',info, function (data) {
            var tem=JSON.parse(data);
            tem.sort(function(a, b) {
                return a[0]<b[0];
            });
            //this.setState({recordData:temp});
            temp=tem;
            var key;


            if (temp===null || temp.length===0){
                key=1;
            }
            else{
                key=parseInt(temp[0][0])+1;
            }
            let infoo= {
                libraryId:this.state.detailData[5],
                recordId:key,
                answer:this.state.text
            };
            this.serverRequest13 = $.post('addRecord',infoo,function (data) {
                this.setState({text:null});
            }.bind(this));

        }.bind(this));

        this.updateFre();
        this.updateDate();
    },

    //record

    showRecord: function(){
        let info={
            libraryId:this.state.detailData[5]
        };
        this.serverRequest10 = $.post('queryRecords',info, function (data) {
            var temp=JSON.parse(data);
            temp.sort(function(a, b) {
                return a[0]<b[0];
            });
            this.setState({record:true,recordData:temp});
        }.bind(this));
    },

    hideRecord: function(){
        this.setState({record:false,answer:null});
    },

    showContent: function(){
        var c=document.getElementById("detailContent");
        c.innerHTML=this.state.detailData[1];
    },

    showRecordDetail: function(e){
        var id=e.target.id;
        var r=parseInt(id.substring(0,id.indexOf("r")));
        var rec=this.state.recordData[r][0];
        var info={
            libraryId:this.state.detailData[5],
            recordId:rec
        };
        this.serverRequest14 = $.post('queryRecordDetails',info,function (data) {
            // this.setState({answer:data});
            var d=document.getElementById("recordDetail");
            d.innerHTML=data;
        }.bind(this));
    },
    renderPopRef: function(){
        return(
            <div id="popref">
                <form>
                    <div>ref: <ReactQuill id="questionref" modules={{ formula: true, toolbar:this.props.toolbarOptions}} style={{height:"200px"}} value={this.state.refText}
                                          onChange={this.saveRef} /></div>
                    <input type="button" value="submit" onClick={this.saveUpdateRef}/>
                </form>
                <button className="close" onClick={this.handleCloseRef}>close</button>
            </div>
        )
    },

    renderRefBtn: function(){
        if (this.state.showRef===true){
            return <button onClick={this.hideReference}>hide reference</button>
        }
        else{
            return <button onClick={this.showReference}>show reference</button>
        }
    },

    renderRef: function(){
        if (this.state.detailData[2]===null){
            if (this.state.detailData[6]===this.state.user[0]) {
                return (
                    <div id="reference">
                        <p id="refContent">no reference yet, create one?</p>
                        <button onClick={this.popRef} id="createRef">Create</button>
                    </div>
                )
            }
            else{
                return(
                    <div id="reference">
                        <p id="refContent">no reference yet</p>
                    </div>
                )
            }
        }
        else{
            if (this.state.detailData[6]===this.state.user[0]) {
                return (
                    <div id="reference">
                        <div id="refContent">{this.state.detailData[2]}</div>
                        <button onClick={this.popRef} id="editRef">Edit</button>
                    </div>
                )
            }
            else{
                return (
                    <div id="reference">
                        <div id="refContent">{this.state.detailData[2]}</div>
                    </div>
                )
            }
        }
    },

    renderEditor: function(){
        return (
            <div id="editor">
                <ReactQuill modules={{ formula: true, toolbar:this.toolbarOptions}} style={{height:"200px"}} value={this.state.text}
                            onChange={this.handleChangeEditor} />
                <button id="editorbtn" onClick={this.handleSubmitEditor}>submit</button>
            </div>
        )
    },

    renderDetail: function(){
        if (this.state.record===false){
            return(
                <div>

                    <p id="detailContent">show content<button onClick={this.showContent}>+</button></p>
                    <button onClick={this.showRecord}>your answer history</button>
                    {this.renderRefBtn()}
                    {this.renderRef()}
                    {this.renderPopRef()}
                    {this.renderEditor()}
                </div>
            )}
        else{
            return(
                <div>
                    <button id="recordbackbtn" onClick={this.hideRecord}>back</button>
                    <div id="recordDetail"> </div>
                    <table>
                        <tbody>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                        </tr>
                        {this.state.recordData.map(function(row, rowidx) {
                            return (
                                <tr id={"r"+rowidx.toString()} key={"r"+rowidx.toString()}>{
                                    row.map(function(cell, idx) {
                                        return <td onClick={this.showRecordDetail}
                                                   id={rowidx.toString()+"r"+idx.toString()} key={"r"+idx.toString()}>{cell}</td>;
                                    }, this)}
                                </tr>
                            );
                        }, this)}
                        </tbody>
                    </table>

                </div>
            )
        }
    },

    render:function(){
        if (this.state.detailData){
        return(
            <div className="detailPage">
                <h id="detailTitle">{this.state.detailData[0]}</h>
                <p id="detailOwner">contributor: {this.state.detailData[3]}</p>
                <p id="detailDate">updated: {this.state.detailData[4]}</p>
                {this.renderDetail()}
            </div>
        )}
        else{
            return (<p> </p>)
        }
    }

})

export  default Detail;