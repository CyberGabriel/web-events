import './App.css';
import React from 'react';
import taskRecording from './utils/taskRecording.json';

class App extends React.Component {
constructor() {
  super();
  this.state = {
    records: [],
    order: [],
    editPermission: {
      allow: false,
      showBtns: true,
      index: ""
    },
    editRecord: {
      newType: "",
      newTag: "",
      newDate: "",
      newTime: ""
    }
  }
}

componentDidMount() {
    this.setState({records: taskRecording.records}, () => {
      this.setInitialOrder();
    });     
}

setInitialOrder() {
  let initialOrder = [];
  for (let i = 0; i < this.state.records.length; i++) {
    initialOrder.push(i);
  }
  this.setState({order: initialOrder});
}

allowEdit(index) {
  const editPermission = {
    allow: true,
    showBtns: false,
    index
  }
  this.setState({...this.state, editPermission})
}

handleEdit(event, index) {
  
  event.preventDefault();
  const updatedRecord = this.state.records[index]
  const {newType, newTag} = {...this.state.editRecord}
  
  if(newType) { updatedRecord.event.type = newType }
  if(newTag) { updatedRecord.setup.nodeName = newTag }
  const formattedDate = this.formatDate(updatedRecord.time).substr(0, 10);
  const formattedTime = this.formatDate(updatedRecord.time).substr(11, 8);

  const newDate = this.state.editRecord.newDate ? this.state.editRecord.newDate : formattedDate
  const newTime = this.state.editRecord.newTime ? this.state.editRecord.newTime : formattedTime

  const dateAndTimeISO = newDate + "T" + newTime + "+0000"
  let toUnixTime = new Date(dateAndTimeISO).getTime()
  updatedRecord.time = toUnixTime
    
  this.setState({...this.state, updatedRecord}, () => this.handleCloseEdit())
}

handleCloseEdit() {
  const editRecord =  {
    newType: "",
    newTag: "",
    newDate: "",
    newTime: ""
  }
  const editPermission = {
    allow: false,
    showBtns: true,
    index: ""
  }
  this.setState({editRecord, editPermission})
}

updateNewType(newValue) {
  let editRecord = {...this.state.editRecord}
  editRecord.newType = newValue;
  this.setState({editRecord})
}

updateNewTag(newValue) {
  let editRecord = {...this.state.editRecord}
  editRecord.newTag = newValue;
  this.setState({editRecord})
}

updateNewDate(newValue) {
  let editRecord = {...this.state.editRecord}
  editRecord.newDate = newValue;
  this.setState({editRecord})
}

updateNewTime(newValue) {
  let editRecord = {...this.state.editRecord}
  editRecord.newTime = newValue;
  this.setState({editRecord})
}

handleReorder(event, indexToReorder) {
  event.preventDefault();
  let newIndex = this.state.order[indexToReorder];
  let recordsCopy = this.state.records
  let recordCopy = recordsCopy[indexToReorder];
  recordsCopy.splice([indexToReorder], 1);
  recordsCopy.splice(newIndex, 0, recordCopy);
  this.setState({records: recordsCopy}, () => this.setInitialOrder());
}

updateNewIndex(newIndex, oldIndex) {
  let newOrder = [...this.state.order]
  newOrder[oldIndex] = newOrder[newIndex]
  this.setState({order: newOrder})
}

handleDelete(indexToDelete) {
  this.setState(prevState => {
    return {
      records: prevState.records.filter((record, index) => index !== indexToDelete)
    }
  })
}

formatDate(unixTime) {
  const date = new Date(unixTime);
  const dateFormat = date.toISOString();
  return dateFormat;
}

  render() {
    
    return (
      <div className="web-events-app">
        <div className="recordsList">
          {this.state.records.map((record, index) => {
            let formattedDate = this.formatDate(record.time).substr(0, 10);
            let formattedTime = this.formatDate(record.time).substr(11, 8);
            return (
              <div className="recordItem" key={index}>
                <h4>{`index: ${index}`}</h4>
                {this.state.editPermission.allow && this.state.editPermission.index === index ?
                <div>
                  <form
                    className="edit"
                    onSubmit={(event) => this.handleEdit(event, index)}
                  >
                    <h3>
                      <label htmlFor="newRecordType">Record type: </label>
                      <input type="text" id={`recordType_${index}`} name="newRecordType" placeholder={record.event.type}
                      value={this.state.editRecord.newType}
                      onChange={(event) => this.updateNewType(event.target.value)}
                      />
                    </h3>
                    <h3>
                      <label htmlFor="newRecordTag">HTML tag: </label>
                      <input type="text" id={`recordTag_${index}`} name="newRecordTag" placeholder={record.setup.nodeName} 
                        value={this.state.editRecord.newTag}
                        onChange={(event) => this.updateNewTag(event.target.value)}
                      />
                    </h3>
                    <h4>
                      <label htmlFor="newDate">Date: </label>
                      <input type="date" id={`recordDate_${index}`} name="newDate"
                        value={this.state.editRecord.newDate || formattedDate}
                        onChange={(event) => this.updateNewDate(event.target.value)}
                      />
                    </h4>
                    <h4>
                      <label htmlFor="newTime">Time: </label>
                      <input type="time" id={`recordTime_${index}`} name="newTime"
                        value={this.state.editRecord.newTime || formattedTime}
                        onChange={(event) => this.updateNewTime(event.target.value)}
                      />
                    </h4>
                    <input type="submit" value="Save" />
                  </form>
                    <button
                    onClick={(event) => this.handleCloseEdit(event, index)}
                    >Close</button>
                </div>
                :
                <div>
                  <h3>{`Record type: ${record.event.type}`}</h3>
                  <h3>{`${record.setup.nodeName ? "HTML tag: " + record.setup.nodeName : "Does not have HTML tag"}`}</h3>
                  <h4>{`Date: ${formattedDate}`}</h4>
                  <h4>{`Time: ${formattedTime}`}</h4>
                  {this.state.editPermission.showBtns && <div className="btns">
                  <button
                    onClick={() => this.allowEdit(index)}
                  >Edit</button>
                    <form
                      className="reorder"
                      onSubmit={(event) => this.handleReorder(event, index)}
                    >
                    <input type="submit" value="Reorder" />
                    <label htmlFor="newIndex">{`New index: (0-${this.state.records.length-1})`}</label>
                    <input type="number" id={`record_${index}`} name="newIndex" placeholder={index} min="0" max={this.state.records.length-1}
                      value={this.state.order[index]}
                      onChange={(event) => this.updateNewIndex(event.target.value, index)}
                    />
                    </form>
                    <button
                      onClick={() => this.handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                  } 
                </div>
                }
              </div>
            )
          })
          }
        </div>
      </div>
  );
  }
}

export default App;
