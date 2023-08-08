const path = require('path');
const pak = require('../package.json');

module.exports = {
  dependencies: {
    'react-native-google-cast': {},
    'react-native-svg': {},
    '@react-native-community/slider': {},
    [pak.name]: {
      root: path.join(__dirname, '..'),
    },
  }
};
