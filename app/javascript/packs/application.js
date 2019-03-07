import axios from 'axios';
import swal from 'sweetalert2';
import autosize from 'autosize'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import hljs from 'highlight.js'

const markdown = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
 
    return ''; // use external default escaping
  }
})
markdown.use(emoji)

// Configure axios to use CSRF-TOKEN from Rails
const token = document.head.querySelector('meta[name="csrf-token"]');
axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;

axios.defaults.headers.common['Accept'] = 'application/json'

window.$actioncableURL = `ws${window.location.protocol === 'https:' ? 's' : ''}://${window.location.host}/cable`

window.$axios = axios
window.$autosize = autosize
window.$markdown = markdown
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
import "../css/tailwind.scss"
