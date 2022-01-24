<template>
  <div>
    <div class="search-con search-con-top">
    <Input  clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
      <Button @click="sync" class="sync-btn" type="primary"><Icon type="sync"/>&nbsp;&nbsp;同步职位</Button>
    </div>
    <Table
      border
      stripe
      ref="selection"
      :columns="columns"
      :data="userData"
      :height="522"
    ></Table>
    <Page
      show-total
      show-sizer
      show-elevator
      :total="page.total"
      :current="page.index"
      :page-size="page.size"
      :page-size-opts="page.opts"
      @on-change="pIndexChange"
      @on-page-size-change="pSizeChange"
    />
    <!-- <Button @click="handleSelectAll(true)">全选</Button>
    <Button @click="handleSelectAll(false)">取消全选</Button> -->
  </div>
</template>
<script>
import { getAllStation, queryStationByName, syncStation} from '@/api/szbank'
import './index.less'
export default {
  name: 'station',
  data () {
    return {
      page: {
        index: 1,
        size: 10,
        total: 50,
        opts: [10, 20, 50, 100]
      },
      total: 0,
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        // },
        {
          title: '编码',
          key: 'stationCode'
        },
        {
          title: '职位',
          key: 'stationName'
        }
        // {
        //   title: "所属部门",
        //   key: "orgName",
        // },
      ],
      userData: [
      ],
      AllStationData: [],
      value: [],
      searchKey: '',
      searchValue: ''
    }
  },

  created () {
    this.queryAllStation()
  },

  methods: {
    queryAllStation () {
      getAllStation().then((res) => {
        if (res.status == '200') {
          this.page.total = res.data.length
          this.AllStationData = res.data.map((item) => {
            return {
              stationCode: item.code,
              stationName: item.stationName
            // orgName: item.orgName,
            }
          })
          var _start = (this.page.index - 1) * this.page.size
          var _end = this.page.index * this.page.size
          this.userData = this.AllStationData.slice(_start, _end)
        }
      })
    },

    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },

    pIndexChange (i) {
      this.page.index = i
      var _start = (this.page.index - 1) * this.page.size
      var _end = this.page.index * this.page.size
      this.userData = this.AllStationData.slice(_start, _end)
    },

    pSizeChange (s) {
      this.page.size = s
      var _start = (this.page.index - 1) * this.page.size
      var _end = this.page.index * this.page.size
      this.userData = this.AllStationData.slice(_start, _end)
    },

    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key !== 'stationName' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },

    handleSearch () {
      var stationName = this.searchValue
      queryStationByName(stationName).then((res) => {
        if (res.status == '200') {
          this.page.total = res.data.length
          this.AllStationData = res.data.map((item) => {
            return {
              stationCode: item.code,
              stationName: item.stationName
            // orgName: item.orgName,
            }
          })
          var _start = (this.page.index - 1) * this.page.size
          var _end = this.page.index * this.page.size
          this.userData = this.AllStationData.slice(_start, _end)
        }
      })
      // this.insideTableData = this.value.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1)
    },

    sync () {
      syncStation().then((res) => {
        if (res.status == '200') {

        }
      })
    },

    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    }
  },

  watch: {
    value (val) {
      this.handleSearch()
    }
  },

  mounted () {
    this.setDefaultSearchKey()
  }
}
</script>
