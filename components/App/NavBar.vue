<script setup>
// const _accountStore = useAccountStore();

// Declare Variables
const state = reactive({
  navigation: [
    { name: "البنايات", href: "/buildings", policy: ["user", "admin"] },
    { name: "الايجارات", href: "/apartments/rents", policy: ["user", "admin"] },
    { name: "الاعلانات", href: "/ads", policy: ["user", "admin"] },
    { name: "المطالبات المالية", href: "/claims", policy: ["user", "admin"] },
    // { name: "الشقق المتاحة للطلبة", href: "/student-apartments", policy: ["user", "admin"] },
    // { name: "الخدمات", href: "/services", policy: ["user", "admin"] },
    // { name: "الصيانة", href: "/maintenances", policy: ["user", "admin"] },
    { name: "الطلبات الجديدة", href: "/orders", policy: ["user", "admin"] },
    { name: "المستخدمين", href: "/users", policy: ["admin"] },
  ],
  selected: "",
});

const { data, signOut } = useAuth();
// Declare Methods
const clickSignOut = async () => {
  const { error } = await signOut({ redirect: false });

  if (error) {
    console.error(`ERROR SIGNOUT:${JSON.stringify(error)}`);
    throw createError({
      statusCode: 500,
      statusMessage: error,
    });
  } else {
    await navigateTo("/auth/login");
  }
};

onMounted(() => state.navigation.map((el) => (el.current = el.href === useRoute().fullPath ? true : false)));
</script>

<template>
  <nav class="bg-gray-800 shadow h-16">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-center xl:justify-between h-16">
        <div class="flex items-center justify-center xl:items-stretch xl:justify-start">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-white text-xl font-bold">مؤسسة<span class="text-primary font-bold"> اربد العقارية.</span></h1>
          </div>

          <div class="hidden xl:block xl:mr-14">
            <div class="flex">
              <NuxtLink
                v-for="item in state.navigation"
                :active-class="'bg-primary-900 text-white'"
                class="px-4 py-1 rounded-md text-gray-100 text-lg font-normal hover:bg-gray-700 hover:text-white"
                :to="item.href"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-white text-base font-normal">
            <span class="ml-2">{{ data?.user?.name }}</span>
            <a @click="clickSignOut" class="text-white underline hover:cursor-pointer">تسجيل الخروج</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
