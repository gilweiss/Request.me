import React from 'react';
import { render } from 'react-dom'
import App from './App';
import MyForm from  './MyForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import {applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


const store = createStore(rootReducer, applyMiddleware(thunk))


render(
<Provider store={store}>
    <MyForm/>
    </Provider>
, document.getElementById('root'));
