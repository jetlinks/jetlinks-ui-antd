<template>
  <div class="container">
    <div class="box"></div>
    <div class="login">
      <div style="padding: 25% 10%;">
        <div style="font-size: 40px; margin-left: 60px">
          <img src="../../assets/img/login.svg" style="margin-left: 10px" />Jetlinks
        </div>
        <div style="color: #605E5C; margin: 10px 0 20px 100px;">开源物联网基础平台</div>
        <a-form
          ref="formRef"
          layout="vertical"
          :model="formState"
          :rules="rules"
        >
          <a-form-item label="账号" name="username">
            <a-input v-model:value="formState.username" placeholder="请输入用户名">
              <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
            </a-input>
          </a-form-item>
          <a-form-item label="密码" name="password">
            <a-input v-model:value="formState.password" type="password" placeholder="请输入密码">
              <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
            </a-input>
          </a-form-item>
          <template v-if="enabled">
            <a-form-item label="验证码" name="verifyCode">
              <a-input v-model:value="formState.verifyCode" placeholder="请输入验证码">
                <template #suffix><img style="width: 80px;" :src="captcha.base64" /></template>
              </a-input>
            </a-form-item>
          </template>
          <a-form-item>
            <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button
              style="width: 100%; border-radius: 5px; background-color: #1463B4"
              type="primary"
              @click="onSubmit"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
<!--      <div class="footer">footer</div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { defineComponent, reactive, UnwrapRef, onMounted, ref, toRaw } from 'vue'
import { isCaptchaConfig, getCaptcha, login, getSystemVersion } from '@/apis/login.ts'
import router from '@/router'

interface FormState {
  username: string;
  password: string;
  remember: boolean;
  verifyCode: string;
}

export default defineComponent({
  name: 'Login',
  setup () {
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ],
      verifyCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ]
    }
    const enabled = ref<boolean>(false)
    const captcha = reactive({
      base64: '',
      key: ''
    })
    const formRef = ref()
    const formState: UnwrapRef<FormState> = reactive({
      username: '',
      password: '',
      remember: false,
      verifyCode: ''
    })
    // 获取验证码
    const getCaptchaImg = () => {
      getCaptcha({ width: 130, height: 40 }).then(resp => {
        if (resp.data.status === 200) {
          captcha.key = resp.data.result.key
          captcha.base64 = resp.data.result.base64
        }
      })
    }
    onMounted(() => {
      isCaptchaConfig().then(resp => {
        const value = resp.data?.result?.enabled
        enabled.value = value
        if (value) {
          getCaptchaImg()
        }
      })
    })
    const getVersion = () => {
      getSystemVersion().then(resp => {
        if (resp.data.status === 200) {
          localStorage.setItem('system-version', resp.data?.result?.edition)
        }
      })
    }
    const onSubmit = () => {
      formRef.value.validate().then(() => {
        const data = { ...toRaw(formState) }
        const params = {
          ...data,
          expires: data.remember ? -1 : 3600000,
          verifyKey: captcha.key
        }
        login(params).then(resp => {
          if (resp.data?.status === 200) {
            const data = resp.data.result
            getVersion()
            localStorage.setItem('hsweb-autz', JSON.stringify(data))
            localStorage.setItem('user-detail', JSON.stringify(data.user))
            localStorage.setItem('x-access-token', data.token)
            router.replace('/')
          } else {
            getCaptchaImg()
          }
        })
      }).catch((error: ValidateErrorEntity<FormState>) => {
        console.log(error)
      })
    }
    return {
      formRef,
      rules,
      enabled,
      captcha,
      formState,
      onSubmit
    }
  },
  components: {
    UserOutlined,
    LockOutlined
  }
})
</script>

<style lang="less">
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    .box {
      width: 75%;
      height: 100%;
      background-image: url('../../assets/img/login.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .login {
      width: 25%;
      background-color: rgba(255, 255, 255);
      height: 100%;
      position: relative;
      .footer {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
      }
    }
  }
</style>
