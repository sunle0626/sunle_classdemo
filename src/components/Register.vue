<template>
    <div>
        <el-header>
            <h1>1601N班管理系统·注册</h1>
        </el-header>
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="user">
            <el-input type="text" v-model="ruleForm2.user" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addForm(ruleForm2)">注册</el-button>
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
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: "",
        checkPass: "",
        user: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    addForm(data) {
      if (data.pass !== "" && data.checkPass !== "" && data.user !== "") {
        if (data.pass === data.checkPass) {
          let json = { user: data.user, pass: hex_md5(data.pass), add: true };
          axios.post("http://127.0.0.1:9000/login", json).then(res => {
            this.$alert(res.data.msg);
            this.$router.push("/login");
          });
        } else {
          this.$alert("注册失败，两次密码不一致");
        }
      } else {
        this.$alert("用户名或密码都不可为空");
      }
    }
  }
};
</script>

<style scoped>
</style>