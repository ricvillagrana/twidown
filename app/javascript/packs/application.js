import axios from 'axios';
import swal from 'sweetalert2';


// Configure axios to use CSRF-TOKEN from Rails
const token = document.head.querySelector('meta[name="csrf-token"]');
axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;

axios.defaults.headers.common['Accept'] = 'application/json'

window.$axios = axios
window.$swal = swal.mixin({
  confirmButtonColor: '#587afd',
  cancelButtonColor: '#FE429E'
})
window.$toast = swal.mixin({
  position: 'top-end',
  toast: true,
  confirmButtonColor: '#587afd',
  cancelButtonColor: '#f27474'
})

// Support component names relative to this directory:
var componentRequireContext = require.context("components", true)
var ReactRailsUJS = require("react_ujs")
ReactRailsUJS.useContext(componentRequireContext)
import "../css/tailwind.css"
