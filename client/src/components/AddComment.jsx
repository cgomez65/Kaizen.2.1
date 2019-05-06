import React, { Component } from 'react';


export default class AddComment extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      noteStatus: false,
      notes: [], 
      maxlength: 100,
      editNote: {},
      editNoteIndex: null,
      comment: ''
    };
  }
  
  addNote(status, event) {
    event.preventDefault();
    this.setState({
      editNote: {},
      noteStatus: status
    });
  }
  
  newNote(data){
    let notes = this.state.notes;
    if(this.state.editNoteIndex !== null) {
      notes[this.state.editNoteIndex] = data;
    }else {
      notes.push(data);
    }
    
    this.setState({
      notes: notes,
      noteStatus: false,
      editNoteIndex: null
    });
  }
  
  editNote(data, key) {
    this.setState({
      editNote: data,
      editNoteIndex: key,
      noteStatus: true
    });
  }
  
  render() {
    return <div className="container">
      <h1>Note</h1>
      <button className="btn btn-default" onClick={this.addNote.bind(this, !this.state.noteStatus)}>{this.state.noteStatus ? 'Cancel' : 'Add Note'}</button>
      <hr />
      {this.state.noteStatus
       ? <Note addNote={this.addNote.bind(this, false)} maxlength={this.state.maxlength} newNote={this.newNote.bind(this)} data={this.state.editNote}/>
       : <List notes={this.state.notes} editNote={this.editNote.bind(this)} />
      }
    </div>;
  }
}

class Note extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {note: {}, count: 0};
  }
  
  getTodayDate() {
    let date = new Date();
    return (date.getFullYear() +'-'+ ("0"+date.getMonth()).slice(-2)+'-'+date.getDate());
  }
  
  componentWillMount() {
    if(this.props.data.text){
      this.setState({
        note: this.props.data,
        date: this.props.data.date
      });
    }
  }
  
  handleNoteChange() {
    let note = this.state.note;
    note.text = this.refs.textarea.value;
    
    this.setState({
      count: this.refs.textarea.value.length,
      note: note
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    let form = document.getElementById('myform');
    let formData = new FormData();
    for (let i = 0; i < form.length; i++) {
      form.elements[i].name 
        ? formData[form.elements[i].name] = form.elements[i].value
        : false;
    }
    
    if(formData.when.toLocaleLowerCase() === 'none'){
      let date = new Date();
      formData.date = date.getFullYear() +'-'+ ("0"+date.getMonth()).slice(-2)+'-'+date.getDate();
    }
    this.props.newNote(formData);
  }
  
  AddComments(comment){
		console.log(`New comment added: ${comment}`);
		$.ajax({
			method: 'POST',
			url: '/comment',
			contentType: 'application/json',
			data: JSON.stringify({
				comment: comment
			})
		}).done(() => {
			this.getData();
			this.setState({
				comment: ''
			})
		});
	}

  selectedWhen(event) {
    event.preventDefault();
    this.props.post
    if(event.target.value.toLowerCase() === 'none') {
      let date = this.getTodayDate();
      this.setState({
        date: date
      }); 
    }
  }
  
  setDate(event) {
    event.preventDefault();
    let date = new Date(event.target.value);
    date = date.getFullYear() +'-'+ ("0"+date.getMonth()).slice(-2)+'-'+date.getDate();
    
    this.setState({
      date: date
    });
  }
  
  getData(){
		$.ajax({
			url:'/comment',
			method: 'GET',
			success:(notes) => {
				this.setState({notes: notes});
				console.log(`This is what currently is listed in Database:`, notes);
			},
			error:(xhr, err) => {
			console.log('you have an err', err);
			}
		});
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} id="myform">
        <div className="form-group">          
          <textarea 
            className="form-control"
            placeholder="Note"
            ref="textarea"
            name="text"
            maxLength={this.props.maxlength}
            defaultValue={this.state.note.text ? this.state.note.text : ''}
            onChange={this.handleNoteChange.bind(this)} />
          <p>{this.props.maxlength - (this.state.note.text ? this.state.note.text.length : this.state.count)} Char left</p>
        </div>
        <div className="form-group">
          <input type="date" name="date" className="form-control" value={this.state.date} onChange={this.setDate.bind(this)}/>
        </div>
        <div className="form-group">
          <select className="form-control" name="when" defaultValue={this.state.note.when ? this.state.note.when : 'Everyday'} onChange={this.selectedWhen.bind(this)}>
            <option value="Everyday">Everyday</option>
            <option value="Every week">Every week</option>
            <option value="Every year">Every year</option>
            <option value="None">None</option>
          </select>
        </div>
        <button type="submit" className="btn btn-default">Submit</button>
        <button className="btn btn-default" onClick={this.props.addNote}>Cancel</button>
      </form>
    )
  }
}

class List  extends React.Component {
  render() {
    return <div className="col-md-12">
        {this.props.notes.length > 0
         ? <ul className="list-group row">
            <li className="list-group-item clearfix">
              <div className="col-md-7">
                Note
              </div>
              <div className="col-md-1">
                When
              </div>
              <div className="col-md-2">
                Date
              </div>
              <div className="col-md-1">
                Action
              </div>
            </li>
            {this.props.notes.map(function(row, key){
              return (<li className="list-group-item clearfix" key={key}>
                  <div className="col-md-7">
                    {row.text}
                  </div>
                  <div className="col-md-1">
                    {row.when}
                  </div>
                  <div className="col-md-2">
                    {row.date ? row.date : '-'}
                  </div>
                  <div className="col-md-1">
                    <button className="btn btn-default glyphicon glyphicon-pencil" onClick={this.props.editNote.bind(this,row, key)}> Edit</button>
                  </div>
                </li>)
            }.bind(this))}
          </ul>
         : "No data"
        }
      </div>;
  }
}

