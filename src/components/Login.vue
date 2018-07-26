<template>
    <div>
        <el-header>
            <h1>1601N班管理系统·登录</h1>
        </el-header>
        <el-form :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width:80%;margin-left:10%">
        <el-form-item label="用户名" prop="user">
            <el-input type="text" v-model="ruleForm.user" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="=Pass">
            <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleForm)">登录</el-button>
            <el-button @click="registerForm(ruleForm)">注册</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { hex_md5 } from "../utils/md5.js";
import axios from "axios";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        user: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    submitForm(data) {
      let json = { ...data, ...{ pass: hex_md5(data.pass) } };
      axios.post("http://127.0.0.1:9000/login", json).then(res => {
        let data = res.data;
        console.log(data);
        if (data.code == 0) {
          this.$alert(data.msg);
          axios
            .get("http://127.0.0.1:9000/accessList?uid=" + data.id)
            .then(res => {
              console.log("res...", res);
              if (data.code == 0) {
                let accessList = res.data.list.map(item => {
                  return item.accessname;
                });
                if (accessList.length == 0) {
                  this.$alert("你当前没有任何权限!");
                } else {
                  window.sessionStorage.setItem(
                    "accessList",
                    JSON.stringify(accessList)
                  );
                  this.$router.push("/content");
                }
              } else {
                this.$alert(res.data.msg);
              }
            });
        } else {
          this.$alert(data.msg);
        }
      });
    },
    registerForm() {
        this.$router.push("/register");
    }
  }
};
</script>

<style scoped>
</style>