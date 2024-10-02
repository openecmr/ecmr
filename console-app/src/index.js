import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);
import App from './App';
import {unregister} from './registerServiceWorker';



ReactDOM.render(<App />, document.getElementById('root'));
unregister();
