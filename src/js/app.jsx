var Base = require('basejs'),
    PouchDB = require('pouchdb'),
    Utils = require('./Utils'),
    EventEmitter = require('events').EventEmitter,
    React = require('react'),
    ReactDOM = require('react-dom'),
    Redux = require('redux'),
    ReactRedux = require('react-redux');

Object.assign(Base.prototype, EventEmitter.prototype);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/worker.entry.js')
    .then(function(reg) {
      console.log("%cService worker registration succeeded", "color: green");
    })
    .catch(function(error) {
      console.log("%cRegistration failed with " + error, "color: red");
    });
}

var DataStore = Base.extend({
});

var PouchDBDataStore = DataStore.extend({
  constructor: function() {
    this.remoteDb = new PouchDB(Utils.pouchDbUrl());
    this.localDb = new PouchDB('notes-db');
  },

  syncFromRemote: function() {
    return new Promise(function(resolve, reject) {
      this.remoteDb.replicate.to(this.localDb).on('complete', function() {
        resolve();
      }).on('error', function(err) {
        reject(err);
      });
    }.bind(this));
  },

  createNew: function() {
    return this.localDb.put({
      _id: 'note-' + new Date().getTime(),
      title: 'Untitled Note',
      body: ''
    });
  },

  getAll: function() {
    return this.localDb.allDocs({
      include_docs: true
    }).then(function(result) {
      return result.rows.map(function(r) { return r.doc; });
    });
  }
});

var RemoteSWDataStore = DataStore.extend({
  constructor: function() {
    this.controller = navigator.serviceWorker.controller;
  }
});

var dataStore = new PouchDBDataStore();
global.dataStore = dataStore;

var initialReduxState = {
  notes: []
};

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialReduxState;
  }

  console.log("Reducer got action:", action);

  if (action.type === 'SET_ALL') {
    return Object.assign({}, state, {
      notes: action.notes
    });
  } else if (action.type === 'NEW_NOTE') {
    return Object.assign({}, state, {
      notes: state.notes.concat([{
        id: (new Date().getTime()).toString(),
        title: 'Untitled New Note',
        body: ''
      }])
    });
  } else {
    return state;
  }
}

var reduxStore = Redux.createStore(reducer);
global.reduxStore = reduxStore;

var NoteRow = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.note.title}
      </div>
    );
  }
});

var NotesListComponent = React.createClass({
  render: function() {
    return (
      <div>
        <div className="btn btn-default" onClick={this.props.onNewNoteClicked}>New</div>
        {this.props.notes.map(function(note) {
          return <NoteRow note={note} key={note._id} />;
        })}
      </div>
    );
  }
});
var NotesList = ReactRedux.connect(
  function(state) {
    return {notes: state.notes};
  },
  function(dispatch) {
    return {
      onNewNoteClicked: function() {
        dispatch({type: 'NEW_NOTE'});
      }
    };
  }
)(NotesListComponent);

var AppView = React.createClass({
  render: function() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <NotesList />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <ReactRedux.Provider store={reduxStore}>
    <AppView />
  </ReactRedux.Provider>,
  document.getElementById('bind-app')
);

function updateNotesFromDataStore() {
  dataStore.getAll().then(function(notes) {
    reduxStore.dispatch({
      type: 'SET_ALL',
      notes: notes
    });
  });
}
updateNotesFromDataStore();
dataStore.syncFromRemote().then(function() {
  console.log("Synced from remote");
  updateNotesFromDataStore();
});

