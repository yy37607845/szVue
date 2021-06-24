<template>
  <div>
    <div class="search-con search-con-top">
    <Input  clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
      <Button @click="syncPeople" class="sync-btn" type="primary"><Icon type="sync"/>&nbsp;&nbsp;同步人员</Button>
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
import { getAllUserInfo, queryUserByUserId, syncPerson} from "@/api/szbank";
import './index.less'
export default {
  name: 'person',
  data() {
    return {
      page: {
        index: 1,
        size: 10,
        total: 50,
        opts: [10,20,50,100]
      },
      total: 0,
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        // },
        {
          title: "工号",
          key: "userId"
        },
        {
          title: "姓名",
          key: "userName",
        },
        {
          title: "职位",
          key: "stationName",
        },
        {
          title: "部门",
          key: "orgName",
        },
      ],
      userData: [
      ],
      AllUserData:[],
      value: [],
      searchKey: '',
      searchValue: ''
    };
  },

  created() {
    this.queryAllUser();
  },

  methods: {
    queryAllUser() {
      getAllUserInfo().then((res) => {
        if(res.status == "200"){
          this.page.total = res.data.length
          this.AllUserData = res.data.map((item) => {
            return {
            userId: item.userId,
            userName: item.userName,
            stationName: item.stationName,
            orgName: item.orgName,}
          })
          var _start = (this.page.index - 1)* this.page.size;
          var _end = this.page.index * this.page.size;
          this.userData = this.AllUserData.slice(_start, _end);
        }
      });
    },

    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },

    pIndexChange(i) {
      this.page.index = i;
      var _start = (this.page.index - 1)* this.page.size;
          var _end = this.page.index * this.page.size;
          this.userData = this.AllUserData.slice(_start, _end);
    },

    pSizeChange(s) {
      this.page.size = s;
      var _start = (this.page.index - 1)* this.page.size;
          var _end = this.page.index * this.page.size;
          this.userData = this.AllUserData.slice(_start, _end);
    },

    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key !== 'stationName' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },

    handleSearch () {
      var userId = this.searchValue;
      queryUserByUserId(userId).then((res) => {
        if(res.status == "200"){
          this.page.total = res.data.length
          this.AllUserData = res.data.map((item) => {
            return {
            userId: item.userId,
            userName: item.userName,
            stationName: item.stationName,
            orgName: item.orgName,}
          })
          var _start = (this.page.index - 1)* this.page.size;
          var _end = this.page.index * this.page.size;
          this.userData = this.AllUserData.slice(_start, _end);
        }
      });
          //this.insideTableData = this.value.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1)
        },

    syncPeople(){
      syncPerson().then((res) => {
        if(res.status == '200'){
          return;
        }
      })
    },

    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
  },

  watch: {
    value(val) {
      this.handleSearch()
    }
  },

  mounted(){
    this.setDefaultSearchKey()
  }
};
</script>
