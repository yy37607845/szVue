<template>
  <div>
    <div class="search-con search-con-top">
      <Input
        @on-change="handleClear"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
      <Button @click="handleSearch" class="search-btn" type="primary"
        ><Icon type="search" />&nbsp;&nbsp;搜索</Button
      >
      <Button @click="sync" class="sync-btn" type="primary"
        ><Icon type="sync" />&nbsp;&nbsp;同步组织</Button
      >
    </div>
    <Table
      border
      stripe
      ref="selection"
      :columns="columns"
      :data="orgData"
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
import { getAllOrg, queryOrgByName, syncOrg } from "@/api/szbank";
import "./index.less";
export default {
  name: 'org',
  data() {
    return {
      page: {
        index: 1,
        size: 10,
        total: 50,
        opts: [10, 20, 50, 100],
      },
      total: 0,
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        // },
        {
          title: "部门编码",
          key: "orgNo",
        },
        {
          title: "部门名称",
          key: "orgName",
        },
        {
          title: "负责岗位",
          key: "mstationName",
        },
      ],
      orgData: [],
      AllOrgData: [],
      value: [],
      searchKey: "",
      searchValue: "",
    };
  },

  created() {
    this.queryAllOrg();
  },

  methods: {
    queryAllOrg() {
      getAllOrg().then((res) => {
        if (res.status == "200") {
          this.page.total = res.data.length;
          this.AllOrgData = res.data.map((item) => {
            return {
              orgNo: item.orgNo,
              mstationName: item.mstationName,
              orgName: item.orgName,
            };
          });
          var _start = (this.page.index - 1) * this.page.size;
          var _end = this.page.index * this.page.size;
          this.orgData = this.AllOrgData.slice(_start, _end);
        }
      });
    },

    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },

    pIndexChange(i) {
      this.page.index = i;
      var _start = (this.page.index - 1) * this.page.size;
      var _end = this.page.index * this.page.size;
      this.orgData = this.AllOrgData.slice(_start, _end);
    },

    pSizeChange(s) {
      this.page.size = s;
      var _start = (this.page.index - 1) * this.page.size;
      var _end = this.page.index * this.page.size;
      this.orgData = this.AllOrgData.slice(_start, _end);
    },

    setDefaultSearchKey() {
      this.searchKey =
        this.columns[0].key !== "stationName"
          ? this.columns[0].key
          : this.columns.length > 1
          ? this.columns[1].key
          : "";
    },

    handleSearch() {
      var orgName = this.searchValue;
      queryOrgByName(orgName).then((res) => {
        if (res.status == "200") {
          this.page.total = res.data.length;
          this.AllOrgData = res.data.map((item) => {
            return {
              orgNo: item.orgNo,
              mstationName: item.mstationName,
              orgName: item.orgName,
            };
          });
          var _start = (this.page.index - 1) * this.page.size;
          var _end = this.page.index * this.page.size;
          this.orgData = this.AllOrgData.slice(_start, _end);
        }
      });
    },

    sync(){
      syncOrg().then((res) => {
        if(res.status == '200'){
          return;
        }
      })
    },

    handleClear(e) {
      if (e.target.value === "") this.insideTableData = this.value;
    },
  },

  watch: {
    value(val) {
      this.handleSearch();
    },
  },

  mounted() {
    this.setDefaultSearchKey();
  },
};
</script>