import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const federated = {
    google_client_id: '329034055005-kdfud7nlsm66g08cjdij1d3e0igv8ln9.apps.googleusercontent.com'
};

ReactDOM.render(<App federated={federated} />, document.getElementById('root'));
registerServiceWorker();
