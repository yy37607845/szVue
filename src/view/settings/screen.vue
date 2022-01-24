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
          >新增大屏</Button
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

    <!-- Modal - 大屏 -->
    <Modal
      v-model="modalShowRole"
      :mask-closable="false"
      :closable="false"
      footer-hide
      :title="modalDataRoleType === 'edit' ? '编辑大屏' : '新增大屏'"
      @on-ok="handleSubmitRole"
    >
      <Form
        ref="formModalDataRole"
        :model="modalDataRole"
        :rules="formModalRule"
        :label-width="100"
        @submit.native.prevent
      >
        <FormItem label="名称：" prop="name">
          <Input type="text" v-model.trim="modalDataRole.name"></Input>
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

    <!-- Modal -关联项目 -->
    <Modal
      v-model="modalShowMenu"
      :mask-closable="false"
      :closable="true"
      footer-hide
      title="关联项目"
      @on-ok="handleSubmitMenu"
    >
      <Select
        v-model="projectSelect"
        filterable
        multiple
      >
        <Option
          v-for="item in projectList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <div style="margin-top：10px">
        <Button
          type="primary"
          @click="handleSubmitMenu"
          :loading="buttonLoading"
          >确定</Button
        >
        <Button
          @click="
            modalShowMenu = false;
            //menuSelectedId = [];
            menuList = JSON.parse(JSON.stringify(menuListOrg));
          "
          style="margin-left: 8px"
          >取消</Button
        >
      </div>
    </Modal>

    <!-- Modal - 大屏-职位 新OA权限设置 -->
    <Modal
      v-model="modalShowNewPermission"
      :mask-closable="false"
      :closable="true"
      footer-hide
      title="权限设置"
      @on-ok="handleNewPermission"
    >
      <Select
        v-model="stationSelect"
        filterable
        multiple
      >
        <Option
          v-for="item in stationList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <div style="margin-top：10px">
        <Button
          type="primary"
          @click="handleNewPermission"
          :loading="buttonLoading"
          >确定</Button
        >
        <Button
          @click="
            modalShowNewPermission = false;
            //menuSelectedId = [];
            listStation = JSON.parse(JSON.stringify(listStations));
          "
          style="margin-left: 8px"
          >取消</Button
        >
      </div>
    </Modal>

    <!-- Modal - 大屏-职位 权限设置 -->
    <Modal
      v-model="modalShowPermission"
      :mask-closable="false"
      footer-hide
      title="权限设置"
      @on-ok="handlePermission"
      @on-cancel="cancelModal"
    >
      <Form
        ref="formModalDataMenu"
        :model="modalDataMenu"
        :label-width="60"
        @submit.native.prevent
      >
        <FormItem label="职位：" prop="stations" class="menu-function">
          <div v-for="(menu, i) in treeDataList" :key="i">
            <Tree :ref="'menu' + i" :data="[menu]" show-checkbox></Tree>
          </div>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            @click="handlePermission('formModalDataMenu')"
            :loading="buttonLoading"
            >确定</Button
          >
          <Button
            @click="
              modalShowPermission = false;
              menuSelectedId = [];
              treeDataList = JSON.parse(JSON.stringify(treeData));
            "
            style="margin-left: 8px"
            >取消</Button
          >
        </FormItem>
      </Form>
    </Modal>

    <!-- Modal - 大屏-职位 权限设置 -->
    <!-- <Modal
      v-model="modalShowPermission"
      :mask-closable="false"
      :closable="true"
      footer-hide
      title="权限设置"
      @on-ok="handlePermission"
      @on-cancel ="cancelModal"
    >
      <tree-select
        v-model="treeSelected"
        style="width: 300px"
        :expand-all="true"
        :data="treeData"
      ></tree-select>
      <div style="margin-top: 10px">
        <Button
          type="primary"
          @click="handlePermission"
          :loading="buttonLoading"
          >确定</Button
        >
        <Button @click="modalShowPermission = false" style="margin-left: 8px"
          >取消</Button
        >
      </div>
    </Modal> -->

    <!-- Modal - 大屏 -->
    <Modal
      v-model="modalShowScreen"
      :mask-closable="false"
      :closable="true"
      footer-hide
      title="新增大屏"
      @on-ok="handleInsertScreen"
    >
      <Cascader :data="screenData" v-model="screenSelectValue"></Cascader>
      <div style="margin-top: 10px">
        <Button
          type="primary"
          @click="handleInsertScreen"
          :loading="buttonLoading"
          >确定</Button
        >
        <Button @click="modalShowScreen = false" style="margin-left: 8px"
          >取消</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
// vuex
import store from '@/store'

// function
import {
  computedMenuData, // 菜单数据转换成iview树形数据结构(多层)
  resultCallback, // 根据请求的status执行回调函数
  getValueByKey // 根据对象数组某个key的value，查询另一个key的value
} from '@/libs/dataHanding'
// api
import {
  getSelectProject, // 获取项目列表
  artRelProject, // 大屏关联项目
  getStationTree, // 大屏设置权限 -- 获取职位树
  getNewOAStationPermission, // 新OA大屏设置权限 -- 获取职位树
  // getAllStationSome,
  getNewAllStation,
  setPermission,
  getAllArtOnline,
  getOnlineArt,
  insertArt,
  updateArtNameById,
  queryArtByName,
  deleteArtById
} from '@/api/szbank'
import '../oaInfo/index.less'
import treeSelect from '../../components/tree-select/tree-select.vue'

// import { refreshRoute } from "@/router"; // 路由初始化，清空动态路由
export default {
  components: { treeSelect },
  name: 'project',
  data () {
    return {
      treeSelected: [], // 已选中的职位权限
      treeData: [], // 大屏关联项目的部门下的职位
      treeDataList: [],

      screenSelectValue: [], // 新增大屏时选择值
      screenData: [], // 大屏级联data

      projectList: [],
      projectSelect: [],

      stationList: [],
      stationSelect: [],

      /* 全局 */
      allStationList: [], // 全部职位列表
      menuListNotComputed: [], // 全部部门列表 - 原始数据未处理
      menuListOrg: [], // 全部部门列表 - 原始数据处理后
      menuList: [], // 全部部门列表 - 渲染后的tree

      listStations: [],
      listStation: [],

      roleSubList: [], // 当前角色的下级角色列表
      screenId: '', // 大屏id - 维护关系用
      /* 每页 */
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      tableColumns: [
        // {
        //   title: "大屏id",
        //   key: "artId",
        //   align: "center",
        //   minWidth: 120,
        // },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth: 120
        },
        {
          title: '大屏地址',
          key: 'publishId',
          align: 'center',
          minWidth: 120
        },
        {
          title: '所属项目',
          key: 'menus',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.menus.map((item) => {
                return h(
                  'Tag',
                  {
                    props: {
                      color: 'blue'
                    },
                    style: {
                      display:
                        getValueByKey(
                          this.menuListNotComputed,
                          'value',
                          item,
                          'label'
                        ) !== ''
                          ? 'inline-block'
                          : 'none'
                    }
                  },
                  getValueByKey(
                    this.menuListNotComputed,
                    'value',
                    item,
                    'label'
                  )
                )
              })
            ])
          },
          minWidth: 500
        },
        {
          title: '权限职位',
          key: 'stations',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.stations.map((item) => {
                return h(
                  'Tag',
                  {
                    props: {
                      color: 'blue'
                    },
                    style: {
                      display:
                        getValueByKey(
                          this.allStationList,
                          'value',
                          item,
                          'label'
                        ) !== ''
                          ? 'inline-block'
                          : 'none'
                    }
                  },
                  getValueByKey(
                    this.allStationList,
                    'value',
                    item,
                    'label'
                  )
                )
              })
            ])
          },
          minWidth: 500
        },

        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Tooltip',
                {
                  props: {
                    trigger: 'hover',
                    content: '修改',
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      icon: 'ios-create-outline'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }
                  })
                ]
              ),
              h(
                'Tooltip',
                {
                  props: {
                    trigger: 'hover',
                    content: '关联项目',
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'ios-menu-outline'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.relateMenus(params.row)
                      }
                    }
                  })
                ]
              ),
              // 新OA 权限设置
              h(
                'Tooltip',
                {
                  props: {
                    trigger: 'hover',
                    content: '权限设置',
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      icon: 'ios-settings'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.NewOAPermisssion(params.row)
                      }
                    }
                  })
                ]
              ),
              // h(
              //   "Tooltip",
              //   {
              //     props: {
              //       trigger: "hover",
              //       content: "权限设置",
              //       placement: "top",
              //       transfer: true,
              //     },
              //   },
              //   [
              //     h("Button", {
              //       props: {
              //         type: "info",
              //         size: "small",
              //         icon: "ios-settings",
              //       },
              //       style: {
              //         marginRight: "5px",
              //       },
              //       on: {
              //         click: () => {
              //           this.queryStationByArtId(params.row);
              //         },
              //       },
              //     }),
              //   ]
              // ),
              h(
                'Tooltip',
                {
                  props: {
                    trigger: 'hover',
                    content: '删除',
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'md-close'
                      // disabled: params.row.name === "super_admin"
                    },
                    on: {
                      click: () => {
                        this.delete(params.row)
                      }
                    }
                  })
                ]
              )
            ])
          }
        }
      ], // 表头列项
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示数量
      /* loading */
      tableLoading: false, // table
      buttonLoading: false, // button
      /* modal弹框 */
      modalShowRole: false, // 是否显示 - role
      modalShowMenu: false, // 是否显示 - menu
      modalShowScreen: false, // 是否显示 - screen
      modalShowPermission: false, // 是否显示 -permission
      modalShowNewPermission: false, // 是否显示 -newPermission
      modalDataRole: {
        id: '',
        artId: '',
        publishId: '',
        name: '',
        description: ''
      }, // 数据 - role
      modalDataMenu: {
        menus: []
      }, // 数据 - menu
      modalDataRoleOrg: {}, // 数据 - role行内原始
      menuSelectList: [], // 已选择的menu - 接口数据
      menuSelectedId: [], // tree提交的menu - id
      formModalRule: {
        name: [
          {
            required: true,
            message: '请输入大屏名称',
            trigger: 'change'
          },
          {
            type: 'string',
            max: 30,
            message: '大屏名称过长',
            trigger: 'change'
          }
        ]
      }, // form规则
      modalDataRoleType: '', // 类型：insert/edit
      searchValue: ''
    }
  },
  async created () {
    this.getData()
    this.getOnlineScreen()
    this.getProjectData() // 获取项目列表
    this.getAllStation()
  },

  methods: {
    // 获取项目数据
    async getProjectData () {
      this.menuListNotComputed = (await getSelectProject()).data || []
      this.projectList = JSON.parse(JSON.stringify(this.menuListNotComputed))
    },
    // 获取首页数据
    async getData () {
      this.tableLoading = true
      this.tableDataOrg = (await getAllArtOnline()).data
      this.refreshData()
      this.buttonLoading = false
      this.tableLoading = false
    },
    // 根据条件刷新数据
    refreshData () {
      this.tableDataOrg.forEach((role) => {})
      // 分页 & 每页条数
      this.tableData = this.tableDataOrg.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      )
      // 如果是在删除之后获取的数据 -> 若删掉的是某一页的最后项且页码不是1，则自动获取前一页的数据
      if (this.tableData.length === 0 && this.tableDataOrg.length !== 0) {
        this.pageNum--
        this.getData()
      }
    },
    // 分页
    changePage (pageNum) {
      this.pageNum = pageNum
      this.refreshData()
    },
    // 每页条数变化
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.pageNum = 1
      this.refreshData()
    },
    /* 角色表单操作 */
    // 点击按钮 - 新增
    insert () {
      this.modalDataRoleType = 'insert'
      // this.$refs.formModalDataRole.resetFields();
      this.modalDataRoleOrg = JSON.parse(JSON.stringify(this.screenData))
      this.modalShowScreen = true
    },
    // 点击按钮 - 编辑
    async edit (row) {
      this.modalDataRoleType = 'edit'
      this.screenId = row.id
      this.modalDataRoleOrg = row
      this.modalDataRole = JSON.parse(JSON.stringify(row))
      this.modalShowRole = true
    },

    // 获取职位
    async getAllStation () {
      // this.allStationList = (await getAllStationSome()).data || [];
      this.allStationList = (await getNewAllStation()).data || []
    },

    // 点击按钮 - 权限设置
    async queryStationByArtId (row) {
      this.screenId = row.id
      // this.modalShowPermission = true;
      getStationTree(this.screenId).then((res) => {
        if (res.data.code == '0') {
          this.treeData = res.data.data
          this.treeDataList = JSON.parse(JSON.stringify(this.treeData))
        }
      })
      this.menuSelectList = JSON.parse(JSON.stringify(row.stations))
      /* 递归方法：如果有子节点 -> 选中包含id的子节点 */
      const childrenHanding = (children) => {
        children.forEach((_menu) => {
          _menu.children.length === 0 &&
            this.menuSelectList.some((__menu) => _menu.id === __menu) &&
            this.$set(_menu, 'checked', true)
          childrenHanding(_menu.children)
        })
      }
      // 根据menuSelectList，动态渲染treeDataList已选中的选项
      this.treeDataList.length > 0 &&
        this.treeDataList.forEach((menu) => {
          if (menu.children.length === 0) {
            // 如果没有子节点 -> 选中包含id的父节点
            this.menuSelectList.some((_menu) => menu.id === _menu) &&
              this.$set(menu, 'checked', true)
          } else {
            // 如果有子节点 -> *递归方法：选中包含id的子节点*
            childrenHanding(menu.children)
          }
        })
      this.modalShowPermission = true
    },

    // 权限设置 --树形结构
    handlePermission () {
      this.buttonLoading = true

      /* 1获取所有的tree中被勾选的节点，concat成一个数组（数组对象） */
      let menuSelected = []
      this.treeDataList.forEach((menu, i) => {
        let menuRef = 'menu' + i
        menuSelected = menuSelected.concat(
          // 获取选中及半选节点
          this.$refs[menuRef][0].getCheckedNodes()
        )
      })
      /* 2.处理被勾选的节点数组 -> 非mock时保留id / mock时保留id和title */
      this.menuSelected = []
      menuSelected.forEach((menu) => {
        this.menuSelected.push(menu.pid)
        this.menuSelected.push(menu.id)
      })
      var stationSelected = this.unique(this.menuSelected)
      setPermission(this.screenId, stationSelected).then((res) => {
        if (res.data.code == '0') {
          resultCallback(200, '新增成功！', () => {
            this.buttonLoading = false
            this.modalShowPermission = false
            this.getData()
            this.treeDataList = JSON.parse(JSON.stringify(this.treeData))
          })
        }
      })
    },

    // 数组去重
    unique (arr) {
      return arr.filter(function (item, index, arr) {
        // 当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        return arr.indexOf(item, 0) === index
      })
    },

    // 关闭权限设置
    cancelModal () {
      this.treeDataList = JSON.parse(JSON.stringify(this.treeData))
    },

    // 新增大屏 -- 级联
    handleInsertScreen () {
      this.buttonLoading = true
      switch (this.modalDataRoleType) {
        case 'insert':
          if (
            this.tableDataOrg.some(
              (item) => item.artId === this.screenSelectValue[1]
            )
          ) {
            this.$Message.error('大屏已经存在!')
            this.buttonLoading = false
          } else {
            var artId = this.screenSelectValue[1]
            // 新增大屏
            insertArt(artId).then((res) => {
              if (res.data.code == '0') {
                resultCallback(200, '新增成功！', () => {
                  this.getData()
                  this.buttonLoading = false
                  this.modalShowScreen = false
                })
              }
            })
          }
      }
    },
    // 提交表单 - 大屏
    handleSubmitRole () {
      this.$refs.formModalDataRole.validate(async (valid) => {
        if (valid) {
          this.buttonLoading = true
          switch (this.modalDataRoleType) {
            case 'edit':
              if (
                (this.tableDataOrg.some(
                  (item) => item.name === this.modalDataRole.name
                ) &&
                  this.modalDataRole.name !== this.modalDataRoleOrg.name) ||
                (this.tableDataOrg.some(
                  (item) => item.artId === this.modalDataRole.artId
                ) &&
                  this.modalDataRole.artId !== this.modalDataRoleOrg.artId)
              ) {
                this.$Message.error('大屏id或名称已存在！')
                this.buttonLoading = false
              } else {
                var artId = this.modalDataRole.artId
                var name = this.modalDataRole.name
                // 修改大屏
                updateArtNameById(artId, name).then((res) => {
                  if (res.data.code == '0') {
                    resultCallback(200, '修改成功！', () => {
                      this.getData()
                      this.buttonLoading = false
                      this.modalShowRole = false
                    })
                  }
                })
              }
              break
          }
        }
      })
    },

    // 搜索大屏
    handleSearch () {
      var screenName = this.searchValue
      queryArtByName(screenName).then((res) => {
        if (res.status == '200') {
          this.tableDataOrg = res.data
          this.refreshData()
        }
      })
    },

    // 点击按钮 - 删除
    delete (row) {
      this.$Modal.confirm({
        title: '确定删除？',
        onOk: async () => {
          // 1.在项目列表删除
          deleteArtById(row.id).then((res) => {
            if (res.data.code == '0') {
              resultCallback(200, '删除成功！', () => {
                this.getData()
              })
            }
          })
        },
        closable: true
      })
    },
    /* 部门表单操作 */
    // 点击按钮 - 关联部门
    async relateMenus (row) {
      this.screenId = row.id
      this.projectSelect = row.menus.map(Number)
      this.modalShowMenu = true
    },

    // 提交表单 - 菜单
    async handleSubmitMenu () {
      this.buttonLoading = true
      // 大屏关联项目
      artRelProject(this.screenId, this.projectSelect).then((res) => {
        if (res.data.code == '0') {
          resultCallback(200, '修改成功！', () => {
            this.buttonLoading = false
            this.modalShowMenu = false
            this.getData()
            // 清空选项
            this.menuList = JSON.parse(JSON.stringify(this.menuListOrg))
          })
        }
      })
    },

    // 点击按钮 - 新OA权限设置
    async NewOAPermisssion (row) {
      this.screenId = row.id
      this.stationSelect = row.stations.map(Number)
      var a = (await getNewOAStationPermission(this.screenId)).data || []
      this.stationList = JSON.parse(JSON.stringify(a))

      this.modalShowNewPermission = true
    },
    // 提交表单 -- 新OA权限
    async handleNewPermission () {
      this.buttonLoading = true
      // 大屏 权限
      setPermission(this.screenId, this.stationSelect).then((res) => {
        if (res.data.code == '0') {
          resultCallback(200, '修改成功！', () => {
            this.buttonLoading = false
            this.modalShowNewPermission = false
            this.getData()
            // 清空选项
            this.listStation = JSON.parse(JSON.stringify(this.listStations))
          })
        }
      })
    },

    // 获取级联已经上线大屏
    getOnlineScreen () {
      getOnlineArt().then((res) => {
        if (res.data.code == '0') {
          this.screenData = res.data.data
        }
      })
    }
  }
}
</script>
