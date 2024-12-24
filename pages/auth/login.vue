<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
// Declare Variables
const state = reactive({
  username: "",
  password: "",
});
const isLoading = ref(false);
// Declare Stores
// const _accountStore = useAccountStore();

const { signIn } = useAuth();
// Declare Methods
const submitForm = async () => {
  console.log("logging....");
  console.log({ state });

  try {
    isLoading.value = true;
    const res = await signIn("credentials", { ...state, redirect: false });
    await navigateTo("/buildings");
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="limiter">
    <div class="container-login">
      <div class="wrap-login">
        <form class="login-form" @submit.prevent="submitForm">
          <span class="login-form-title mb-12">
            <img class="mx-auto h-32 w-auto mb-4" src="@/assets/logo.svg" alt="Your Company" />
            تسجيل دخول الى حسابك
          </span>

          <div class="wrap-input mb-8">
            <input
              id="username"
              name="username"
              :size="'lg'"
              :autofocus="true"
              :required="true"
              v-model="state.username"
              placeholder="رقم المعرف"
              class="input100"
            />
            <span class="focus-input"></span>
          </div>

          <div class="wrap-input mb-8">
            <input
              id="password"
              name="password"
              type="password"
              :size="'lg'"
              :required="true"
              v-model="state.password"
              placeholder="كلمة السر"
              class="input100"
            />
            <span class="focus-input"></span>
          </div>

          <div class="flex justify-between items-center mb-8">
            <label class="checkbox-container">
              تذكرني
              <input type="checkbox" />
              <span class="checkmark"></span>
            </label>

            <a href="#" class="text-sm hover:text-primary-500 transition-colors"> هل نسيت كلمة السر؟ </a>
          </div>

          <button :type="'submit'" :size="'lg'" :loading="isLoading" class="login-form-btn">دخول</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.limiter {
  width: 100%;
  margin: 0 auto;
}

.container-login {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: linear-gradient(135deg, rgba(174, 204, 54, 0.9), /* Primary lime green */ rgba(140, 139, 139, 0.85) /* Secondary gray */);
  background-size: cover;
  background-position: center;
}

.wrap-login {
  width: 500px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 55px 55px 33px 55px;
  box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
}

.login-form {
  width: 100%;
}

.login-form-title {
  display: block;
  font-size: 30px;
  color: #333333;
  line-height: 1.2;
  text-align: center;
}

.wrap-input {
  position: relative;
  width: 100%;
  z-index: 1;
}

.input100 {
  font-size: 15px;
  line-height: 1.5;
  color: #666666;
  width: 100%;
  background: #e6e6e6;
  height: 50px;
  border-radius: 25px;
  padding: 0 30px;
  transition: all 0.4s;
}

.input100:focus {
  background: #fff;
  box-shadow: 0 5px 30px 0px rgba(0, 0, 0, 0.1);
}

.focus-input {
  display: block;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 0px 0px;
  color: rgba(91, 104, 235, 0.8);
}

.login-form-btn {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background: linear-gradient(135deg, #aecc36, #8c8b8b);
  font-size: 15px;
  color: #fff;
  text-transform: uppercase;
  transition: all 0.4s;
}

.login-form-btn:hover {
  background: linear-gradient(135deg, #8c8b8b, #aecc36);
}

.checkbox-container {
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #e6e6e6;
  border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background: linear-gradient(135deg, #aecc36, #8c8b8b);
}
</style>
