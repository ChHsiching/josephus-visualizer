import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Import highlight.js and dependencies
import hljs from 'highlight.js/lib/core'
import hljsVuePlugin from '@highlightjs/vue-plugin'

// Import C language support
import c from 'highlight.js/lib/languages/c'

// Register C language
hljs.registerLanguage('c', c)

const app = createApp(App)
app.use(hljsVuePlugin)
app.mount('#app')
