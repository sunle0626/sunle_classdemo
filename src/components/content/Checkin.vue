<template>
    <div>
        <el-header style="border-bottom:3px solid #ccc">
           <h3>1601N点名系统</h3> 
        </el-header>
        <el-main>
            <el-table
            :data='list'
            border
            style="width: 100%"
            @selection-change="handleSelectionChange">
                <el-table-column
                prop="username"
                label="姓名"
                align='center'
                width="300">
                </el-table-column>
                <el-table-column
                prop="id"
                align='center'
                label="学号">
                </el-table-column>
                <el-table-column
                align='center'
                type="selection"
                width="55">
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="Naming">点击提交点名表</el-button>
        </el-main>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      list: [],
      namingnum: {
        Should: 0,
        Actual: 0,
        leave: 0
      }
    };
  },
  mounted() {
    axios.get("http://127.0.0.1:9000/userList").then(res => {
      if (res.data.code == 0) {
        this.list = res.data.data;
      } else {
        this.$alert(res.data.msg);
      }
    });
  },
  methods: {
    Naming() {
      this.$confirm(`应到${this.namingnum.Should},实到${this.namingnum.Actual},请假
        ${this.namingnum.leave}`)
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleSelectionChange(val) {
      let Should = this.list.length;
      let Actual = val.length;
      let leave = Should - Actual;
      this.namingnum = {
        Should,
        Actual,
        leave
      };
    }
  }
};
</script>

<style scoped>
</style>