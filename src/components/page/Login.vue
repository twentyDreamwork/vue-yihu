<template>
<div class="login-wrap">
  <div class="ms-login">
    <div class="ms-title">广东电信社区楼宇沙盘作战系统</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入账号">
          <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" >
          <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="verifycode">
        <el-input v-model="ruleForm.verifycode" placeholder="请输入验证码" class="identifyinput" ></el-input>
        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>

      </el-form-item>
      <el-form-item>
        <div class="identifybox">
          <div @click="refreshCode">
            <s-identify :identifyCode="identifyCode"></s-identify>
          </div>
          <el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>
        </div>
      </el-form-item>
      <div class="login-btn">
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import SIdentify from '@/components/common/identify.vue'

export default {
  data: function() {
    // 验证码自定义验证规则
    var validateVerifycode = (rule, value, callback) => {
      console.log(value);
      if (value == '' || value == undefined) {
        callback(new Error('请输入验证码'))
      } else if (value !== this.identifyCode) {
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
       if (value === '') {
         callback(new Error('请输入账号'));
       }else {
         callback()
       }
     };
    var validatePass = (rule, value, callback) => {
       if (value === '') {
         callback(new Error('请输入密码'));
       }else {
         callback()
       }
     };
    return {
      ruleForm: {
        username: '',
        password: '',
        verifycode: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur',
          validator:validateName
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur',
          validator:validatePass
        }],
        verifycode: [{
            required: true,
            trigger: 'blur',
            validator: validateVerifycode
        }]
      },
        identifyCodes: '1234567890',
        identifyCode: ''
      }
    },
    components: {
        SIdentify
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              localStorage.setItem('ms_username', this.ruleForm.username);
              this.$router.push('/');
            } else {
              this.$message.error('失败！');
              return false;
            }
          });
        },
        randomNum(min, max) {
          // 生成随机数
          return Math.floor(Math.random() * (max - min) + min)
        },
        refreshCode() {
          // 切换验证码
          this.identifyCode = ''
          this.makeCode(this.identifyCodes, 4)
        },
        makeCode(o, l) {
          // 生成四位随机验证码
          for (let i = 0; i < l; i++) {
            this.identifyCode += this.identifyCodes[
              this.randomNum(0, this.identifyCodes.length)
            ]
          }
          console.log(this.identifyCode)
        }
      },
      mounted() {
        // 验证码初始化
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
      }

  }
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}

.identifybox {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
}
</style>
