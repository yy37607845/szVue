<template>
  <div class="demo-split">
    <Split v-model="split">
      <div slot="left" class="demo-split-pane">
        <Scroll  :height="750">
          <Card
            dis-hover
            v-for="(item, index) in leftList"
            :key="index"
            style="margin: 32px 0"
          >
            <Button style="width: 100%; height:100%" @click="changeTableData(item.projectId)">{{ item.projectName }}</Button>
          </Card>
        </Scroll>
      </div>

      <div slot="right" class="demo-split-pane">
          <Table
        :data="tableData"
        :loading="tableLoading"
        :columns="tableColumns"
        stripe
        border
      ></Table>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: right">
          <Page
            show-sizer
            transfer
            placement="top"
            :total="tableDataOrg.length"
            :current.sync="pageNum"
            :page-size-opts="[10, 20, 50, 100]"
            :page-size="pageSize"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
          ></Page>
        </div>
      </div>
      </div>
    </Split>
  </div>
</template>

<script>
import store from "@/store";
import {
  getPersonProjectList,
  getAllScreenByProjectId
} from "@/api/szbank";
export default {
  name: "auth",
  data() {
    return {
      split: 0.3,
      leftList: [],
      tableLoading: false,
      tableData: [],    // 处理后的当页数据
      tableDataOrg: [], // 原始数据
      tableColumns:[
          {
          title: "名称",
          key: "artName",
          align: "center",
          minWidth: 120,
        },
        {
          title: "大屏地址",
          key: "publishId",
          align: "center",
          minWidth: 120,
          render:(h, params) => {
            return h('span', {
              domProps:{
                innerHTML: "<a href = http://155.103.100.215:9099/publish/"+ params.row.publishId + " target='_blank'>"+params.row.publishId+"</a>",
              }
            })
          }
        },
      ],
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示数量
      projectId: '',
    };
  },

    async created() {
        this.getData();
        this.getLeftProjectData();
    },

  methods: {
    //获取左边项目数据
    getLeftProjectData(){
      var userOrgId = store.state.user.userOrgId;
      var userId = store.state.user.userId;
      getPersonProjectList(userOrgId, userId).then( (res) => {
        this.leftList = res.data
      })
    },

    // 获取table数据
    async getData() {
        this.tableLoading = true;
        this.tableDataOrg = (await getAllScreenByProjectId(this.projectId)).data.data;
        this.refreshData();
        this.tableLoading = false;
    },

    //点击更改table数据
     changeTableData(projectId){
        this.tableLoading = true;
        getAllScreenByProjectId(projectId).then( (res) => {
          if(res.data.code == '0'){
          this.tableDataOrg = res.data.data;
          }
        })
        this.refreshData();
        this.tableLoading = false;
    },

      // 根据条件刷新数据
    refreshData() {
      this.tableDataOrg.forEach((role) => {});
      // 分页 & 每页条数
      this.tableData = this.tableDataOrg.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
      // 如果是在删除之后获取的数据 -> 若删掉的是某一页的最后项且页码不是1，则自动获取前一页的数据
      if (this.tableData.length === 0 && this.tableDataOrg.length !== 0) {
        this.pageNum--;
        this.getData();
      }
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.refreshData();
    },
    // 每页条数变化
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.refreshData();
    },

    //当滚动至底部时，触发加载更多。
    handleReachBottom () {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const last = this.leftList[this.leftList.length - 1];
                        for (let i = 1; i < 11; i++) {
                            this.leftList.push(last + i);
                        }
                        resolve();
                    }, 2000);
                });
            }
  }
};
</script>
<style>
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  height: 100%;
  padding: 10px;
}
</style>