import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      dark : {
        primary: '#3657c0',
        secondary: '#3da2f1',
        info: '#dde0ff',
        success: '#00ac4c',
        warning: '#ffc202',
        error: '#ff637c',
        accent: '#ffffff'
      },
      light : {
        primary: '#093564',
        secondary: '#3da2f1',
        info: '#dde0ff',
        success: '#00ac4c',
        warning: '#ffd600',
        error: '#d81109',
        accent: '#001529'
      },
    }
  }
})
