<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请输入用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm,
  },

  data() {
    return {
      userId: "",
      key: "",
    };
  },
  
  mounted() {
    var userName = this.userId = this.getQueryVariable("userId") || "";
    var password = this.key = this.getQueryVariable("key") || "";
    if(userName != '' && password !=''){
      this.handleLogin({ userName, password }).then((res) => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
      });
      //登录前清空缓存的标签
      localStorage.tagNaveList = [];
    }else{
      console.log('账号密码不能为空')
    } 
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then((res) => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
      });
      //登录前清空缓存的标签
      localStorage.tagNaveList = [];
    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    openChrome(){
      var url = window.location.href;
      var objShell = new ActiveXObject("WScript.Shell");
      var cmd = "cmd.exe /c start D:\\software\\Chrome\\Application\\chrome.exe " + url;
      objShell.Run(cmd, 0, true);
    }
  },
};
</script>

<style>
</style>
