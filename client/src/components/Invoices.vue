<template>
  <div class="invoices">
    <v-flex>
      <v-btn small ripple @click="uploadToggle = !uploadToggle" color="primary" class="btn">
        <v-icon style="margin-right: 0.5rem">mdi-autorenew</v-icon>
        Update
      </v-btn>
      <v-btn small ripple color="secondary" class="btn">
        <v-icon style="margin-right: 0.5rem">mdi-file-outline</v-icon>
        Templates
      </v-btn>
    </v-flex>

    <upload-dialog
      title="Update Invoices"
      :show="uploadToggle"
      @confirmed="submit"
      @done="uploadToggle = !uploadToggle"
    >
    </upload-dialog>

    <v-card>
      <v-card-title>
        Invoices
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="invoices"
        :search="search"
        footer-props.items-per-page-options="[10, 25, 50, 100]"
      >
        <template v-slot:body="{ items }">
          <tbody v-if="items.length">
            <tr v-for="item in items" :key="item.invoice_number">
              <td class="text-xs-left">{{ item.invoice_number }}</td>
              <td class="text-xs-left">{{item.client_name}}</td>
              <td class="text-xs-left">{{item.total_amount}}</td>
              <td class="text-xs-left" v-if="item.open_balance === 0" style="color: #48b165"><em>{{item.open_balance}}</em></td>
              <td class="text-xs-left" v-else style="color: #ff6666"><em>{{item.open_balance}}</em></td>
              <td class="text-xs-left">{{ formatDate(item.date) }}</td>
              <td class="text-xs-left">{{ formatDate(item.due_dat) }}</td>
              <td class="text-xs-left">
                <v-btn outlined small fab color="secondary"><v-icon>mdi-cloud-upload</v-icon></v-btn>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <v-flex style="margin: 1rem">
              <v-icon style="margin-right: 1rem;" color="error">mdi-cancel</v-icon>
              No invoices found
            </v-flex>
          </tbody>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import UploadDialog from '@/components/common/uploadDialog'
import invoiceService from '@/services/invoices'
import moment from 'moment'

export default {
  name: 'Invoices',
  components: {UploadDialog},
  data () {
    return {
      supportingDocs: [],
      search: '',
      headers: [
        {
          text: 'Invoice No.',
          align: 'left',
          sortable: true,
          value: 'invoice_number'
        },
        {
          text: 'Client',
          sortable: true,
          value: 'client_name'
        },
        {
          text: 'Amount',
          value: 'total_amount'
        },
        {
          text: 'Open Balance',
          value: 'open_balance'
        },
        {
          text: 'Date',
          sortable: true,
          value: 'date'
        },
        {
          text: 'Due Date',
          sortable: true,
          value: 'due_date'
        },
        {
          text: 'Documents',
          value: 'documents'
        }
      ],
      invoices: [],
      isLoading: false,
      done: false,
      uploadToggle: false,
      invoiceId: null,
      responseMessage: '',
      error: {
        activate: false,
        message: ''
      }
    }
  },
  methods: {
    async submit (files) {
      let fileData = new FormData()
      if (files.length) {
        for (let file of files) {
          fileData.append('attachment', file)
        }
        try {
          const response = await invoiceService.update('123user_id', fileData)
          this.invoices = response.data.data
        } catch (err) {
          console.log('Error: ', err)
        }
      }
    },
    formatDate(value) {
      return moment(value).format("MMMM Do, YYYY")
    }
  }
}
</script>

<style scoped>
div {
  margin: 0.5rem
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
