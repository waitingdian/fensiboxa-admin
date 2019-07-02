<template>
  <el-dialog
    title="修改积分"
    :visible.sync="dialogVisible"
    v-loading="loading"
    class="dialog-visible"
    @close="close"
    width="420px">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="用户名称" class="m-b-0">
        <template>{{ originForm }}</template>
      </el-form-item>
      <el-form-item label="原积分" class="m-b-0">
        <template>{{ originForm }}</template>
      </el-form-item>
      <el-form-item label="修改积分" prop="integral">
        <el-input :placeholder="originForm" v-model.trim="form.integral"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "integral-dialog",
    data () {
      return {
        dialogVisible: false,
        loading: false,
        form: {
          integral: ''
        }
      }
    },
    props: {
      originForm: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           this.updateIntegral()
          } else {
            return false;
          }
        });
      },
      updateIntegral () {
        this.loading = true
        this.$axios.$post(`/user/update/${originForm.id}`, {
          credit: Number(this.form.integral)
        }).then((res) => {
          this.loading = false
          this.dialogVisible = false
          this.$message.success("更新积分成功")
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
