(function() {
  angular.module('notely.notes.service', [])
    .service('notes', notesService);

  notesService['$inject'] = ['$http', '$filter', '$state'];
  function notesService($http, $filter, $state) {
    var notes = [];
    var nevernoteBasePath = 'https://nevernote-1150.herokuapp.com/api/v1/';
    var user = {
      apiKey: '$2a$10$3UAODMts8D3bK8uqwe2mF.F39vZD3/CypYXLUk1yvhpedfbMiBaFW'
    }

    this.all = function() {
      return notes;
    }

    this.findById = function(noteId) {
      var note = ($filter('filter')(notes, {
        id: parseInt(noteId)
      }, true)[0] || {});

      return angular.copy(note);
    }

    this.fetchNotes = function() {
      return $http.get(nevernoteBasePath + 'notes?api_key=' + user.apiKey)
        .success(function(notesData) {
          notes = notesData;
        });
    };

    this.replaceNote = function(note) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === note.id) {
          notes.splice(i, 1);
          notes.unshift(note);
          break;
        }
      }
    };

    this.removeNote = function(note) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === note.id) {
          notes.splice(i, 1);
          break;
        }
      }
    };

    this.create = function(note) {
      $http.post(nevernoteBasePath + 'notes', {
        api_key: user.apiKey,
        note: {
          title: note.title,
          body_html: note.body_html
        }
      })
        .success(function(noteData) {
          notes.unshift(noteData.note);
          $state.go('notes.form', { noteId: noteData.note.id });
        });
    }

    this.update = function(note) {
      var self = this;
      return $http.put(nevernoteBasePath + 'notes/' + note.id, {
        api_key: user.apiKey,
        note: {
          title: note.title,
          body_html: note.body_html
        }
      }).success(function(noteData) {
        self.replaceNote(noteData.note);
      });
    }

    this.delete = function(note) {
      var self = this;
      return $http.delete(nevernoteBasePath + 'notes/' + note.id + '?api_key=' + user.apiKey)
      .success(function(result) {
        self.removeNote(note);
      });
    }
  }
})();
