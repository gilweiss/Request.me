import React from 'react';
import { render } from 'react-dom'
import App from './App';
import MyForm from  './MyForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'


const store = createStore(rootReducer)


render(
<Provider store={store}>
    <MyForm />
    </Provider>
, document.getElementById('root'));
