<template>
  <div class="task-first">
    <div class="wrap">
      <ul class="list">
        <li v-for="(item, index) in list" :key="index" class="list-item">
          <Button class="list-btn">
            <a :href="prefix + item.publish_id" target="_blank">{{
              item.name
            }}</a>
          </Button>
        </li>
        <!-- <li>
          <Button type=""
            ><a
              href="http://119.45.200.52:9099/publish/2593a2c7924c4ccf83feb41ea5ef12ae"
              target="_blank"
              >存贷款日报</a
            ></Button
          >
        </li>
        <li>
          <Button type=""
            ><a
              href="http://119.45.200.52:9099/publish/7cb0eb413a58476a8e1bd18e98e0cdba"
              target="_blank"
              >劳动竞赛业务屏</a
            ></Button
          >
        </li>
        <li>
          <Button type=""
            ><a
              href="http://119.45.200.52:9099/publish/82176cdb22214cf5b0eaa32ad92f1976"
              target="_blank"
              >劳动竞赛战区屏</a
            ></Button
          >
        </li> -->
      </ul>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import store from "@/store";
export default {
  name: 'first',
  data() {
    return {
      prefix: "http://119.45.200.52:9099/publish/",
      //prefix: "http://155.103.100.215:9099/publish/",
      list: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapActions(["getListData"]),

    getData() {
      var userName = store.state.user.userName;
      this.getListData({ userName }).then((res) => {
        if (res.status === 200) {
          this.list = res.data.map((item) => {
            return {
              name: item.name,
              publish_id: item.publish_id,
            };
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.task-first {
  .wrap {
    .list {
      list-style: none;
      width: 1200px;
      margin-right: 20px;
      padding: auto;
      display: flex;
      .list-item {
        height: 200px;
        width: 300px;
        margin-left: 20px;

        .list-btn {
          width: 100%;
          height: 100%;
          //background-image: url("../../../public/screen.png");
          //background-color: greenyellow;
          a {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
          &:hover {
            background-color: #cccc;
          }
        }
      }
    }
  }
}
</style>