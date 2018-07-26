<template>
    <div>
        <el-table
            ref="multipleTable"
            tooltip-effect="dark"
            :data='list'
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            prop="username"
            label="姓名"
            width="120"
            align='center'>
            </el-table-column>
            <el-table-column
            prop="add"
            label="地址"
            width='480'
            align='center'
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="address"
            label="操作"
            align='center'
            show-overflow-tooltip>
                <template slot-scope="scope">
                <el-button
                @click.native.prevent="deleteRow(scope)"
                type="text"
                size="small">
                移除
                </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      list: []
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      axios.get("http://127.0.0.1:9000/userList").then(res => {
        if (res.data.code == 0) {
          this.list = res.data.data;
          console.log(this.list);
        } else {
          this.$alert(res.data.msg);
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteRow(data) {
      console.log(data.row);
      axios.get("http://127.0.0.1:9000/delete?id=" + data.row.id).then(res => {
        console.log(res);
        this.$alert(res.data.msg);
        if (res.data.code == 0) {
            this.getdata();
        } else {
          this.$alert(res.data.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>