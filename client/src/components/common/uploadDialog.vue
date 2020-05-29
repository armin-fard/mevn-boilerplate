<template>
  <div>
    <v-dialog persistent width="650px" height="400px" v-model="shown">
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-divider></v-divider>
        <v-layout elevation-2 class="clickable-card">
          <vue-dropzone
            v-if="this.$vuetify.theme.dark"
            ref="dropZone"
            id="drop"
            class="drop-dark"
            :options="dropOptions"
            :include-stylings='false'
            @vdropzone-complete="afterComplete"
            v-on:vdropzone-success="success"
          >
          </vue-dropzone>
          <vue-dropzone
            v-else
            ref="dropZone"
            id="drop"
            class="drop-light"
            :options="dropOptions"
            :include-stylings='false'
            @vdropzone-complete="afterComplete"
            v-on:vdropzone-success="success"
          >
          </vue-dropzone>
        </v-layout>
        <v-divider></v-divider>
        <v-card-actions style="display: flex; justify-content: center">
          <v-btn small v-if="fileValidation" color="success" @click="submit"><v-icon>mdi-check-circle</v-icon>{{ buttons.submit }}</v-btn>
          <v-btn small v-else color="error">Invalid file type: must be a .csv file.</v-btn>
          <v-btn small color="warning" @click="clear"><v-icon>mdi-close-circle</v-icon>{{ buttons.cancel }}</v-btn>
          <v-btn small 
          color="error" @click="done"><v-icon>mdi-cancel</v-icon>{{ buttons.done }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'  
const getTemplate = () => `
<div class="dz-preview dz-file-preview">
  <div class="dz-image">
    <div data-dz-thumbnail-bg></div>
  </div>
  <div class="dz-details">
    <div class="dz-filename"><span data-dz-name></span></div>
  </div>
  <div class="dz-progress">
    <span class="dz-upload" data-dz-uploadprogress></span>
  </div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
  <div class="dz-success-mark"><i class="fa fa-check"></i></div>
  <div class="dz-error-mark"><i class="fa fa-close"></i></div>
</div>
`
export default {
  name: 'upload-dialog',
  components: {
    vueDropzone: vue2Dropzone
  },
  props: {
    show : {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
    },
    buttons: {
      type: Object,
      default: function () {
        return {
          submit: 'Submit',
          cancel: 'Clear',
          done: 'Done'
        }
      }
    }
  },
  data () {
    return {
      dropOptions: {
        previewTemplate: getTemplate(),
        url: 'https://httpbin.org/post',
        maxFilesize: 10,
        maxFiles: 4,
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        dictDefaultMessage: "Drop file to upload"
      },
      files: [],
    }
  },
  computed: {
    shown () {
      return this.show
    }
  },
  methods: {
    success () {
      console.log('Upload successfully')
    },
    submit () {
      this.$emit('confirmed', this.files)
      this.clear()
    },
    clear () {
      this.files = []
      this.$refs.dropZone.removeAllFiles()
    },
    done () {
      this.clear()
      this.$emit('done')
    },
    afterComplete (file) {
      if (file) {
        this.files.push(file)
        this.dropOptions.dictDefaultMessage = ''
      } else {
        this.error = 'Files not found'
      }
    },
    fileValidation () {
      let valid = true
      if (this.files.length > 0) {
        if (this.files[0].type !== 'text/csv' && this.files[0].type !== 'application/vnd.ms-excel') {
          valid = false
        } else {
          valid = true
        }
      }
      return valid
    }
  }
}
</script>

<style scoped>
#drop {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.03rem dashed;
  border-radius: 1rem;
  height: 10rem;
  width: 100%
}
.drop-dark {
  background-color: rgb(31, 31, 31);
}
.drop-light {
  background-color: rgb(255, 251, 251);   
}
.drop-dark:hover {
  background-color: rgb(37, 37, 37);   
}
.drop-light:hover {
  background-color: rgb(216, 216, 216);
}
#drop >>> .dz-preview {
  width: 45%;
}
#drop >>> .dz-details {
  border-radius: 1rem;
  height: 6rem;
  width: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.drop-dark >>> .dz-details {
  background: rgb(73, 73, 73);
}
.drop-light >>> .dz-details {
  background: #093564;
}
#drop >>> .dz-filename {
  font-size: 1rem;
}
</style>

