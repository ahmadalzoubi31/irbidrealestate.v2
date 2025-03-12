<script setup lang="ts">
import type { Claim, ClaimCollection, ClaimDetail } from "@prisma/client";
import format from "date-fns/format";

definePageMeta({
  layout: "generate",
});

// *** Fetch Data ***
const selectedClaimId = Number(useRoute().params.id);
const { getOneClaim } = useClaimActions();
const { data: claim } = await getOneClaim(selectedClaimId);
console.log("🚀 ~ claim:", toRaw(claim));

// *** Config Generator ***
const heading = ["رقم المطالبة", "رقم الشقة", "المطلوب منه", "تاريخ المطالبة", "مجموع المبلغ"];
const keys = ["claimNumber", "apartmentName", "claimFrom", "claimDate", "total"];
const isModalOpen = ref(false);
const modalData = ref("");
const extracted = computed(() => (claim ? useExtractKeys(claim, keys) : {}));

console.log("🚀 ~ extracted:", extracted.value);
const fillModalProperties = async (rowContent: string) => {
  const imageUrl = await getImageUrl(rowContent, false);
  modalData.value = imageUrl;
  isModalOpen.value = true;
};

const getImageUrl = async (key: string, download = false) => {
  if (!key) return "";
  const res = await $fetch<any>("/api/v2/files/" + key);

  const base64Data = res.body.split(",")[1]; // Extract base64 data
  const mimeType = res.mimeType; // Ensure the response contains the MIME type
  const url = base64ToBlobUrl(base64Data, mimeType);

  return url;
};

const base64ToBlobUrl = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
};
</script>

<template>
  <div class="min-h-screen">
    <UModal v-model="isModalOpen">
      <div class="p-4 w-full">
        <NuxtImg :src="modalData" sizes="100vw" />
      </div>
    </UModal>
    <!-- Header -->
    <header class="bg-gradient-to-r from-primary-800 to-primary-600 shadow-lg">
      <div class="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 class="text-white text-2xl font-bold">مؤسسة <span class="text-primary-200 font-extrabold">اربد العقارية</span></h1>
        <img src="@/assets/logo.png" alt="Logo" class="h-16 w-16 transform hover:scale-105 transition-transform duration-300" />
      </div>
    </header>

    <!-- Body -->
    <main class="bg-white -mb-12 pb-7">
      <!-- Claim Information -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-3xl font-bold text-primary-800 mb-6 border-b pb-3">معلومات المطالبة</h2>
        <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="(key, index) in keys" class="p-4 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors duration-300">
            <dt class="text-gray-600 mb-2">{{ heading[index] }}</dt>
            <dd class="text-primary-700 font-semibold">{{ extracted[key] || "-" }}</dd>
          </div>
        </dl>
      </section>

      <!-- Details Information -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-3xl font-bold text-primary-800 mb-6 border-b pb-3">تفاصيل المطالبة</h2>
        <dl class="grid grid-cols-1 gap-1">
          <div class="mt-2">
            <!-- Handle claim collections field -->
            <dd class="font-normal text-primary-500">
              <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
                <UTable
                  :rows="claim?.claimDetails as ClaimDetail[] || []"
                  :columns="[
                    { key: 'item', label: 'المادة' },
                    { key: 'price', label: 'السعر' },
                    { key: 'dateTime', label: 'الوقت والتاريخ' },
                    { key: 'image', label: 'الفاتورة' },
                  ]"
                >
                  <template #dateTime-data="{ row }">
                    <span>
                      {{ format(row.dateTime, "dd/MM/yyyy hh:mm:ss") }}
                    </span>
                  </template>
                  <template #price-data="{ row }">
                    <span>{{ row.price + " دينار" }}</span>
                  </template>
                  <template #image-data="{ row }">
                    <div
                      v-if="row.image"
                      @click="fillModalProperties(row.image)"
                      class="font-bold text-primary-600 hover:text-primary-500 hover:cursor-pointer"
                    >
                      <UIcon name="i-heroicons-eye-20-solid" class="h-5 w-5 flex-shrink-0 align-sub" />
                      مشاهدة
                    </div>
                  </template>
                </UTable>
              </div>
            </dd>
          </div>
        </dl>
      </section>

      <!-- Details Information -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-3xl font-bold text-primary-800 mb-6 border-b pb-3">تفاصيل التحصيل</h2>
        <dl class="grid grid-cols-1 gap-1">
          <div class="mt-2">
            <!-- Handle claim collections field -->
            <dd class="font-normal text-primary-500">
              <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-[0.25rem] mb-2">
                <UTable
                  :rows="claim?.claimCollections as ClaimCollection[] || []"
                  :columns="[
                    { key: 'dateTime', label: 'الوقت والتاريخ' },
                    { key: 'payment', label: 'الدفعة' },
                    { key: 'notes', label: 'الملاحظات' },
                  ]"
                >
                  <template #dateTime-data="{ row }">
                    <span>
                      {{ format(row.dateTime, "dd/MM/yyyy hh:mm:ss") }}
                    </span>
                  </template>
                  <template #payment-data="{ row }">
                    <span>{{ row.payment + " دينار" }}</span>
                  </template>
                </UTable>
              </div>
            </dd>
          </div>
        </dl>
      </section>
    </main>

    <!-- Footer -->
    <footer>
      <div class="relative mt-16 bg-primary-500">
        <svg class="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-primary-500" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path
            fill="currentColor"
            d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
          ></path>
        </svg>
        <div class="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
          <div class="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <div class="sm:col-span-2">
              <a href="/" aria-label="Go home" title="Company" class="inline-flex items-center">
                <!-- <svg
                class="w-8 text-[#8c8b8b]"
                viewBox="0 0 24 24"
                stroke-linejoin="round"
                stroke-width="2"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke="currentColor"
                fill="none"
              >
                <rect x="3" y="1" width="7" height="12"></rect>
                <rect x="3" y="17" width="7" height="6"></rect>
                <rect x="14" y="1" width="7" height="6"></rect>
                <rect x="14" y="11" width="7" height="12"></rect>
              </svg> -->
                <span class="ml-2 text-xl font-bold tracking-wide text-gray-500 uppercase">مؤسسة اربد العقارية</span>
              </a>
              <div class="mt-4 lg:max-w-sm">
                <p class="text-sm text-primary-50">
                  رؤيتنا هي العمل على توفير افضل الفرص العقارية والاستثماريه للعميل "تاجير وبيع جميع العقارات والاراضي التجاريه وتصميم كل
                  ما يخص العقارات "
                </p>
                <!-- <p class="mt-4 text-sm text-primary-50">
                Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p> -->
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <p class="text-base font-bold tracking-wide text-gray-500">التواصل</p>
              <div class="flex">
                <p class="mr-1 text-gray-700">الرقم:</p>
                <a
                  href="tel:07-7110-8080"
                  aria-label="Our phone"
                  title="Our phone"
                  class="transition-colors duration-300 text-primary-50 hover:text-gray-700"
                >
                  0771108080
                </a>
              </div>
              <div class="flex">
                <p class="mr-1 text-gray-700">الايميل:</p>
                <a
                  href="mailto:irbidrealestate@gmail.com"
                  aria-label="Our email"
                  title="Our email"
                  class="transition-colors duration-300 text-primary-50 hover:text-gray-700"
                >
                  irbidrealestate@gmail.com
                </a>
              </div>
              <div class="flex">
                <p class="mr-1 text-gray-700">العنوان:</p>
                <a
                  href="https://maps.app.goo.gl/um5hDbeYpT9HBGC99"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Our address"
                  title="Our address"
                  class="transition-colors duration-300 text-primary-50 hover:text-gray-700"
                >
                  اربد , ش المدينه المنوره <br />جنوب قصر العدل <br />
                  (مجمع بهاء الدين)
                </a>
              </div>
            </div>
            <div>
              <span class="text-base font-bold tracking-wide text-gray-500">قنوات التواصل الاجتماعي</span>
              <div class="flex items-center mt-4 sm:mt-2">
                <a href="/" class="ml-3 transition-colors duration-300 text-primary-100 hover:text-[#8c8b8b]">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="h-5">
                    <path
                      d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"
                    ></path>
                  </svg>
                </a>
                <a href="/" class="ml-3 transition-colors duration-300 text-primary-100 hover:text-[#8c8b8b]">
                  <svg viewBox="0 0 30 30" fill="currentColor" class="h-6">
                    <circle cx="15" cy="15" r="4"></circle>
                    <path
                      d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"
                    ></path>
                  </svg>
                </a>
                <a href="/" class="ml-3 transition-colors duration-300 text-primary-100 hover:text-[#8c8b8b]">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="h-5">
                    <path
                      d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"
                    ></path>
                  </svg>
                </a>
              </div>
              <!-- <p class="mt-4 text-sm text-gray-500">Bacon ipsum dolor amet short ribs pig sausage prosciutto chicken spare ribs salami.</p> -->
            </div>
          </div>
          <div class="flex flex-col justify-between pt-5 pb-10 border-t border-primary-200 sm:flex-row">
            <p class="text-sm text-gray-100">© حقوق النشر 2025 لمؤسسة اربد العقارية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
