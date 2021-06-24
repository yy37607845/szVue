<template>
  <div>
    <Card>
      <!-- 操作 -->
      <div class="search-con search-con-top">
        <Input
          clearable
          placeholder="输入关键字搜索"
          class="search-input"
          v-model="searchValue"
        />
        <Button @click="handleSearch" class="search-btn" type="primary"
          ><Icon type="search" />&nbsp;&nbsp;搜索</Button
        >
        <Button class="sync-btn" type="primary" icon="md-add" @click="insert"
          >新增项目</Button
        >
      </div>
      <!-- 表格 -->
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
    </Card>

    <!-- Modal - 角色 -->
    <Modal
      v-model="modalShowRole"
      :mask-closable="false"
      :closable="false"
      footer-hide
      :title="modalDataRoleType === 'edit' ? '编辑项目' : '新增项目'"
      @on-ok="handleSubmitRole"
    >
      <Form
        ref="formModalDataRole"
        :model="modalDataRole"
        :rules="formModalRule"
        :label-width="100"
        @submit.native.prevent
      >
        <!-- <FormItem label="标识："
                  prop="id">
          <Input type="text"
                 v-model.trim="modalDataRole.id"
                 ></Input>
        </FormItem> -->
        <FormItem label="名称：" prop="name">
          <Input type="text" v-model.trim="modalDataRole.name"></Input>
        </FormItem>
        <FormItem label="描述：" prop="description">
          <Input type="text" v-model.trim="modalDataRole.description"></Input>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            @click="handleSubmitRole('formModalDataRole')"
            :loading="buttonLoading"
            >确定</Button
          >
          <Button @click="modalShowRole = false" style="margin-left: 8px"
            >取消</Button
          >
        </FormItem>
      </Form>
    </Modal>

    <!-- Modal - 菜单 -->
    <Modal
      v-model="modalShowMenu"
      :mask-closable="false"
      footer-hide
      title="关联部门"
      @on-ok="handleSubmitMenu"
      @on-cancel ="cancelModal"
    >
      <Form
        ref="formModalDataMenu"
        :model="modalDataMenu"
        :label-width="60"
        @submit.native.prevent
      >
        <FormItem label="部门：" prop="menus" class="menu-function">
          <div v-for="(menu, i) in menuList" :key="i">
            <Tree :ref="'menu' + i" :data="[menu]" show-checkbox></Tree>
          </div>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            @click="handleSubmitMenu('formModalDataMenu')"
            :loading="buttonLoading"
            >确定</Button
          >
          <Button
            @click="
              modalShowMenu = false;
              menuSelectedId = [];
              menuList = JSON.parse(JSON.stringify(menuListOrg));
            "
            style="margin-left: 8px"
            >取消</Button
          >
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
// vuex
import store from "@/store";

// function
import {
  computedMenuData, // 菜单数据转换成iview树形数据结构(多层)
  resultCallback, // 根据请求的status执行回调函数
  getValueByKey, // 根据对象数组某个key的value，查询另一个key的value
} from "@/libs/dataHanding";
// api
import {
  getAllProject,
  insertOrUpdateProject,
  queryProjectByName,
  delProjectById,
  updateRelatedOrg,
} from "@/api/szbank";
import { getAllOrgSome } from "@/api/data";
import "../oaInfo/index.less";

//import { refreshRoute } from "@/router"; // 路由初始化，清空动态路由
export default {
  name: "project",
  data() {
    return {
      /* 全局 */
      menuListNotComputed: [], // 全部部门列表 - 原始数据未处理
      menuListOrg: [], // 全部部门列表 - 原始数据处理后
      menuList: [], // 全部部门列表 - 渲染后的tree
      roleSubList: [], // 当前角色的下级角色列表
      projectId: "", // 项目id - 维护关系用
      /* 每页 */
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      tableColumns: [
        // {
        //   title: "项目id",
        //   key: "id",
        //   align: "center",
        //   minWidth: 120,
        // },
        {
          title: "名称",
          key: "name",
          align: "center",
          minWidth: 120,
        },
        {
          title: "描述",
          key: "description",
          align: "center",
          minWidth: 120,
        },
        {
          title: "部门",
          key: "menus",
          align: "center",
          render: (h, params) => {
            return h("div", [
              params.row.menus.map((item) => {
                return h(
                  "Tag",
                  {
                    props: {
                      color: "blue",
                    },
                    style: {
                      display:
                        getValueByKey(
                          this.menuListNotComputed,
                          "id",
                          item,
                          "objname"
                        ) !== ""
                          ? "inline-block"
                          : "none",
                    },
                  },
                  getValueByKey(this.menuListNotComputed, "id", item, "objname")
                );
              }),
            ]);
          },
          minWidth: 500,
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    trigger: "hover",
                    content: "修改",
                    placement: "top",
                    transfer: true,
                  },
                },
                [
                  h("Button", {
                    props: {
                      type: "primary",
                      size: "small",
                      icon: "ios-create-outline",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      },
                    },
                  }),
                ]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    trigger: "hover",
                    content: "关联部门",
                    placement: "top",
                    transfer: true,
                  },
                },
                [
                  h("Button", {
                    props: {
                      type: "info",
                      size: "small",
                      icon: "ios-menu-outline",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.relateMenus(params.row);
                      },
                    },
                  }),
                ]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    trigger: "hover",
                    content: "删除",
                    placement: "top",
                    transfer: true,
                  },
                },
                [
                  h("Button", {
                    props: {
                      type: "error",
                      size: "small",
                      icon: "md-close",
                      // disabled: params.row.name === "super_admin"
                    },
                    on: {
                      click: () => {
                        this.delete(params.row);
                      },
                    },
                  }),
                ]
              ),
            ]);
          },
        },
      ], // 表头列项
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示数量
      /* loading */
      tableLoading: false, // table
      buttonLoading: false, // button
      /* modal弹框 */
      modalShowRole: false, // 是否显示 - role
      modalShowMenu: false, // 是否显示 - menu
      modalDataRole: {
        id: "",
        name: "",
        description: "",
      }, // 数据 - role
      modalDataMenu: {
        menus: [],
      }, // 数据 - menu
      modalDataRoleOrg: {}, // 数据 - role行内原始
      menuSelectList: [], // 已选择的menu - 接口数据
      menuSelectedId: [], // tree提交的menu - id
      formModalRule: {
        name: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: "change",
          },
          {
            type: "string",
            max: 30,
            message: "项目名称过长",
            trigger: "change",
          },
        ],
        description: [
          {
            type: "string",
            max: 100,
            message: "描述过长",
            trigger: "change",
          },
        ],
      }, // form规则
      modalDataRoleType: "", // 类型：insert/edit
      searchValue: "",
    };
  },
  async created() {
    this.getMenuData();
    this.getData();
  },
  methods: {
    // 获取部门数据
    async getMenuData() {
      // 未处理的menu数据 -> 功能列表筛选用
      this.menuListNotComputed = (await getAllOrgSome()).data || [];
      // 设置menuList的副本，每次关联时以副本为基准清空已选项
      this.menuListOrg = computedMenuData(this.menuListNotComputed);
      this.menuList = JSON.parse(JSON.stringify(this.menuListOrg));
    },
    // 获取首页数据
    async getData() {
      this.tableLoading = true;
      this.tableDataOrg = (await getAllProject()).data;
      this.refreshData();
      this.buttonLoading = false;
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
    /* 角色表单操作 */
    // 点击按钮 - 新增
    insert() {
      this.modalDataRoleType = "insert";
      this.$refs.formModalDataRole.resetFields();
      this.modalDataRoleOrg = JSON.parse(JSON.stringify(this.modalDataRole));
      this.modalShowRole = true;
    },
    // 点击按钮 - 编辑
    async edit(row) {
      this.modalDataRoleType = "edit";
      this.projectId = row.id;
      this.modalDataRoleOrg = row;
      this.modalDataRole = JSON.parse(JSON.stringify(row));
      this.modalShowRole = true;
    },
    // 提交表单 - 项目
    handleSubmitRole() {
      this.$refs.formModalDataRole.validate(async (valid) => {
        if (valid) {
          this.buttonLoading = true;
          switch (this.modalDataRoleType) {
            case "insert":
              if (
                this.tableDataOrg.some(
                  (item) => item.name === this.modalDataRole.name
                ) ||
                this.tableDataOrg.some(
                  (item) => item.id === this.modalDataRole.id
                )
              ) {
                this.$Message.error("项目id或名称已存在！");
                this.buttonLoading = false;
              } else {
                var id = this.modalDataRole.id;
                var name = this.modalDataRole.name;
                var description = this.modalDataRole.description;
                //新增项目
                insertOrUpdateProject(id, name, description).then((res) => {
                  if (res.status == "200") {
                    resultCallback(200, "添加成功！", () => {
                      this.getData();
                      this.buttonLoading = false;
                      this.modalShowRole = false;
                    });
                  }
                });
              }
              break;
            case "edit":
              if (
                (this.tableDataOrg.some(
                  (item) => item.name === this.modalDataRole.name
                ) &&
                  this.modalDataRole.name !== this.modalDataRoleOrg.name) ||
                (this.tableDataOrg.some(
                  (item) => item.id === this.modalDataRole.id
                ) &&
                  this.modalDataRole.id !== this.modalDataRoleOrg.id)
              ) {
                this.$Message.error("项目id或名称已存在！");
                this.buttonLoading = false;
              } else {
                // 1.在角色列表更新
                // this.$set(
                //   roleList,
                //   (this.pageNum - 1) * this.pageSize +
                //     this.modalDataRole._index,
                //   JSON.parse(JSON.stringify(this.modalDataRole))
                // );
                // 2.若修改了角色标识，则还需在用户列表更新
                // this.modalDataRole.name !== this.modalDataRoleOrg.name &&
                //   userList.forEach(user => {
                //     // 判断删除绑定用户：外循环用户列表，内循环用户的角色
                //     user.access.forEach((_access, i) => {
                //       // 筛选用户_access与modalDataRoleOrg.name相同的用户 ->修改这个用户的相关角色
                //       _access === this.modalDataRoleOrg.name &&
                //         this.$set(user.access, i, this.modalDataRole.name);
                //     });
                //   });
                var id = this.modalDataRole.id;
                var name = this.modalDataRole.name;
                var description = this.modalDataRole.description;
                //修改项目
                insertOrUpdateProject(id, name, description).then((res) => {
                  if (res.data.code == "0") {
                    resultCallback(200, "修改成功！", () => {
                      this.getData();
                      this.buttonLoading = false;
                      this.modalShowRole = false;
                    });
                  }
                });
              }
              break;
          }
        }
      });
    },

    //搜索项目
    handleSearch() {
      var projectName = this.searchValue;
      queryProjectByName(projectName).then((res) => {
        if (res.status == "200") {
          this.tableDataOrg = res.data;
          this.refreshData();
        }
      });
    },

    // 点击按钮 - 删除
    delete(row) {
      this.$Modal.confirm({
        title: "已绑定该项目的大屏将失去关联，确定删除？",
        onOk: async () => {
          // 1.在项目列表删除
          delProjectById(row.id).then((res) => {
            if (res.data.code == "0") {
              resultCallback(200, "删除成功！", () => {
                this.getData();
              });
            }
          });
          // 2.在用户列表更新
          // userList.forEach(user => {
          //   // 判断删除绑定用户：外循环用户列表，内循环用户的角色
          //   user.access.forEach((_access, i) => {
          //     // 筛选用户_access与row.name相同的用户 -> 找出包含这个角色的用户并删除用户绑定的该角色
          //     _access === row.name && user.access.splice(i, 1);
          //   });
          // });
        },
        closable: true,
      });
    },
    /* 部门表单操作 */
    // 点击按钮 - 关联部门
    async relateMenus(row) {
      this.projectId = row.id;
      this.menuSelectList = JSON.parse(JSON.stringify(row.menus));
      //  console.log(this.menuSelectList);
      /* 递归方法：如果有子节点 -> 选中包含id的子节点 */
      const childrenHanding = (children) => {
        children.forEach((_menu) => {
          _menu.children.length === 0 &&
            this.menuSelectList.some((__menu) => _menu.id === __menu) &&
            this.$set(_menu, "checked", true);
          // row.name === "super_admin" &&
          //   this.$set(_menu, "disableCheckbox", true); // super_admin所有子节点禁止选择
          childrenHanding(_menu.children);
        });
      };
      // 根据menuSelectList，动态渲染menuList已选中的选项
      this.menuList.length > 0 &&
        this.menuList.forEach((menu) => {
          // row.name === "super_admin" &&
          //   this.$set(menu, "disableCheckbox", true); // super_admin所有父节点禁止选择
          if (menu.children.length === 0) {
            // 如果没有子节点 -> 选中包含id的父节点
            this.menuSelectList.some((_menu) => menu.id === _menu) &&
              this.$set(menu, "checked", true);
          } else {
            // 如果有子节点 -> *递归方法：选中包含id的子节点*
            childrenHanding(menu.children);
          }
        });
      this.modalShowMenu = true;
    },

    //关闭表单 - 部门
    async cancelModal(){
      this.menuList = JSON.parse(JSON.stringify(this.menuListOrg));
    },
    // 提交表单 - 部门
    async handleSubmitMenu() {
      this.buttonLoading = true;
      /* 1获取所有的tree中被勾选的节点，concat成一个数组（数组对象） */
      let menuSelected = [];
      this.menuList.forEach((menu, i) => {
        let menuRef = "menu" + i;
        menuSelected = menuSelected.concat(
          // 获取选中及半选节点
          this.$refs[menuRef][0].getCheckedNodes()
        );
      });
      /* 2.处理被勾选的节点数组 -> 非mock时保留id / mock时保留id和title */
      this.menuSelected = [];
      menuSelected.forEach((menu) => {
        this.menuSelected.push(menu.parentId);
        this.menuSelected.push(menu.id);
        
      });
      var projectSelected = this.unique(this.menuSelected);
      /* 3.调用接口 */
      updateRelatedOrg(this.projectId, projectSelected).then((res) => {
        if (res.data.code == "0") {
          resultCallback(200, "修改成功！", () => {
            this.buttonLoading = false;
            this.modalShowMenu = false;
            this.getData();
            // 清空选项
            this.menuList = JSON.parse(JSON.stringify(this.menuListOrg));
          });
        }
      });
    },
    // 刷新左侧菜单数据
    refreshRouteData() {
      localStorage.setItem("dynamicRouter-template", []);
      //refreshRoute();
      store.dispatch("getRouters").then((res) => {
        this.getData();
      });
    },
    //数组去重
    unique(arr) {
      return arr.filter(function (item, index, arr) {
        //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        return arr.indexOf(item, 0) === index;
      });
    },
  },
};
</script>