<template>
  <div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button>其它</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder=" 请 输 入 关 键 字 " style="width:30%"></el-input>
      <el-button style="margin-left: 10px" type="primary" @click="list">查询</el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 90%">
      <el-table-column
          prop="id"
          label="ID"
          sortable>
      </el-table-column>
      <el-table-column
          prop="name"
          label="家居名">
      </el-table-column>
      <el-table-column
          prop="maker"
          label="厂家">
      </el-table-column>
      <el-table-column
          prop="price"
          label="价格">
      </el-table-column>
      <el-table-column
          prop="sales" label="销量">
      </el-table-column>
      <el-table-column
          prop="stock"
          label="库存">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" type="text">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？" @confirm="handleDel(scope.row.id)">
            <template #reference>
              <el-button size="mini" type="text">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--    引入分页组件-可以根据自己的需要进行定制-->
    <div style="margin: 10px 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1,5,10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <!--1. el-dialog ：v-model="dialogVisible" 表示对话框, 和 dialogVisible 变量双向绑定,控制是否显示对话框
        2. el-form :model="form" 表示表单数据和 form 数据变量双向绑定
        3. el-input v-model="form.name" 表示表单的 input 控件，名字为 name 需要和后台 Javabean 属性一致-->
    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <!--        老师说明: prop="name"表示和rules的那个规则关联-->
        <el-form-item label="家居名" prop="name">
          <el-input v-model="form.name" style="width: 50%"></el-input>
          <!--          显示返回的后端校验信息-vue的插入表达式-->
          {{ validMsg.name }}
        </el-form-item>
        <el-form-item label="厂商" prop="maker">
          <el-input v-model="form.maker" style="width: 50%"></el-input>
          {{ validMsg.maker }}
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" style="width: 50%"></el-input>
          {{ validMsg.price }}
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input v-model="form.sales" style="width: 50%"></el-input>
          {{ validMsg.sales }}
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" style="width: 50%"></el-input>
          {{ validMsg.stock }}
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import request from "@/utils/request";

export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      validMsg:{},
      currentPage: 1,//当前页
      pageSize: 5, //每页显示几条记录
      total: 10, //一共有多少条记录, 会通过请求获取到表中对应的记录数
      dialogVisible: false,
      form: {},
      search: '',
      tableData: [],
      rules: { //提交表单的验证规则
        name: [
          {required: true, message: '请输入家居名', trigger: 'blur'}
        ],
        maker: [
          {required: true, message: '请输入称制造商', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入价格', trigger: 'blur'},
          // 正则表达式,我们讲解java基础时,老韩详细讲过,java web又使用到
          {pattern: /^(([1-9]\d*)|(0))(\.\d+)?$/, message: '请输入数字', trigger: 'blur'}
        ],
        sales: [
          {required: true, message: '请输入销量', trigger: 'blur'},
          {pattern: /^(([1-9]\d*)|(0))$/, message: '请输入数字', trigger: 'blur'}
        ],
        stock: [
          {required: true, message: '请输入库存', trigger: 'blur'},
          {pattern: /^(([1-9]\d*)|(0))$/, message: '请输入数字', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.list()
  },
  methods: {
    //处理pageSize的变化
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.list() //刷新家居列表
    },
    //处理currentPage的变化
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
      this.list() //刷新家居列表
    },
    handleDel(id) {
      //使用request发出请求,删除当前的家居
      //如果显示和关闭vue方法参数提示->settings->inlay hints
      request.delete("/api/del/" + id).then(res => {
        //判断
        if (res.code === "200") {//删除成功
          this.$message({
            type: "success",
            message: "删除成功"
          })
        } else { //删除失败
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
      //刷新家居列表
      this.list()
    },
    list() {//显示家居信息, 后面老师考虑检索条件
      // request.get("/api/furns").then(res => {
      //   console.log("res=", res)
      //   //将返回的数据和tableData绑定
      //   this.tableData = res.data
      // })
      //分页查询 + 带条件
      request.get("/api/furnsBySearchPage", {
        params: {//访问地址时所需要携带的参数
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        // console.log("res=", res)
        //将返回的数据和tableData绑定
        this.tableData = res.data.records
        //修改total
        this.total = res.data.total
      })
    },
    save() {
      if (this.form.id) {
        request.put("/api/update", this.form).then(
            res => {
              if (res.code == 200) {
                //修改成功消息框
                this.$message({ //弹出更新成功的消息框
                  type: "success", message: "更新成功"
                })
              } else {
                this.$message({//弹出更新失败信息
                  type: "error", message: res.msg
                })
              }
              this.list() //刷新列表
              this.dialogVisible = false
            })
      } else { //执行添加
        ///api/save 真实对应的请求地址url 是 http://localhost:9090/save
        // request.post("/api/save", this.form).then(
        //     res => {  //是箭头函数-前端技术栈讲过
        //       //res就是后端程序返回给前端的结果
        //       console.log("res=", res)
        //       this.dialogVisible = false
        //       this.list()  //刷新家居列表
        //     }
        // )

        //这里我们添加时,和表单验证关联,如果验证没有通过，就不提交
        this.$refs['form'].validate((valid) => {
          //为了配合后端校验，老师给他前端校验放行, 测试完毕，再修改回来
          // valid = true
          if (valid) { //前端验证通过
            request.post("/api/save", this.form).then(
                res => {  //是箭头函数-前端技术栈讲过

                  if (res.code === "200") { //添加成功
                    //res就是后端程序返回给前端的结果
                    console.log("res=", res)
                    this.dialogVisible = false
                    this.list()  //刷新家居列表
                  } else if (res.code === "400") { //后端校验失败

                    //取出返回的校验错误信息
                    this.validMsg.name = res.data.name
                    this.validMsg.maker = res.data.maker
                    this.validMsg.price = res.data.price
                    this.validMsg.sales = res.data.sales
                    this.validMsg.stock = res.data.stock

                  }


                }
            )
          } else {
            this.$message({
              type: "error",
              message: "验证没有通过, 不提交"
            })
            return false;
          }
        })
      }
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    add() {
      this.dialogVisible = true
      this.form = {}
      //将上次表单验证的信息清空
      this.$refs['form'].resetFields()
      //将上次后端返回的校验信息清空
      this.validMsg = {}
    }
  }
}
</script>
