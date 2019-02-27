//import React from 'react'
//import ReactDOM from 'react-dom'
//import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//import axios from 'axios';
////import swal from 'sweetalert2';


//// Configure axios to use CSRF-TOKEN from Rails
//const token = document.head.querySelector('meta[name="csrf-token"]');
//axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;

//axios.defaults.headers.common['Accept'] = 'application/json'

//window.$axios = axios
////window.$swal = swal

//let rendered = false;

//const render = () => {
  //ReactDOM.render(
    //<Router>
      //<div>
        //<Route path="/" exact     component={require('../components/Home.js').default} />
      //</div>
    //</Router>,
    //document.getElementById('container')
  //);
  //rendered = true
//}

//document.addEventListener('turbolinks:load', () => {
  //if (!rendered) render();
//});

// Support component names relative to this directory:
var componentRequireContext = require.context("components", true)
var ReactRailsUJS = require("react_ujs")
ReactRailsUJS.useContext(componentRequireContext)
import "../css/tailwind.css"