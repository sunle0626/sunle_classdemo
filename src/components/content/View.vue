<template>
    <div>
        <el-header style="border-bottom:3px solid #ccc" >
            <p class="header_p">日期</p>
            <p class="header_p">{{data.date}}</p>
        </el-header>
        <el-main>
            <el-table
                :data='data.list'
                border
                style="width: 100%">
                <el-table-column
                prop="date"
                label="日期"
                align='center'
                width="280">
                <template slot-scope="scope">
                    {{data.date}}
                </template>
                </el-table-column>
                <el-table-column
                prop="username"
                label="姓名"
                align='center'
                width="300">
                </el-table-column>
                <el-table-column
                prop="score"
                align='center'
                label="成绩">
                </el-table-column>
            </el-table>
        </el-main>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
        data:{}
    };
  },
  mounted() {
    axios.get("http://127.0.0.1:9000/reportList").then(res => {
      console.log(res.data[0]);
      this.data = res.data[0]
    });
  }
};
</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
}
.header_p{
    line-height: 30px;
}
</style>