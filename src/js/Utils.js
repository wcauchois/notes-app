function pouchDbUrl() {
  return location.origin + '/notes-db';
}

module.exports = {
  pouchDbUrl: pouchDbUrl
};

