<script setup lang="ts">
import type { Ad } from "@prisma/client";

definePageMeta({
  layout: "generate",
});

// Validate the id
onBeforeMount(() => {
  const paramId: number = Number(useRoute().params.id);
  console.log("🚀 ~ onBeforeMount ~ paramId:", paramId);
  if (!isNaN(paramId)) return;

  // Redirect to the home page
  navigateTo("/ads");
});

// *** Define Variables ***
const selectedPaymentId: string = useRoute().params.id as string;
const { data: ad } = await useAsyncData<Ad, any>("getOneAd", () => $fetch<Ad>("/api/ads/" + selectedPaymentId));
const imageList = computed(() => ad.value.files.filter((el) => !el.name.includes("mp4")));

const videoList = computed(() => ad.value.files.filter((el) => el.name.includes("mp4")));
// Helper to define headings and keys based on `ad.code`
const getConfig = (code: string) => {
  if (code.includes("LS") || code.includes("LR")) {
    return {
      heading: [
        "رقم الاعلان",
        "حالة العقار",
        "نوع العقار",
        "رابط الفيسبوك",
        "رابط الانستقرام",
        "المحافظة",
        "المديرية",
        "القرية",
        "الحوض",
        "رقم القطعة",
        "الحي",
        "تصنيف الارض",
        "الملاحظات",
      ],
      keys: [
        "code",
        "propertyStatus",
        "propertyType",
        "facebookLink",
        "instagramLink",
        "governorate",
        "directorate",
        "village",
        "basin",
        "plot",
        "neighborhood",
        "classification",
        "notes",
      ],
    };
  } else if (code.includes("ASI")) {
    return {
      heading: [
        "رقم الاعلان",
        "حالة العقار",
        "نوع العقار",
        "رابط الفيسبوك",
        "رابط الانستقرام",
        "المحافظة",
        "المديرية",
        "القرية",
        "الحوض",
        "رقم القطعة",
        "الحي",
        "رقم الشقة",
        "دخل الايجار المتوقع",
        "الملاحظات",
      ],
      keys: [
        "code",
        "propertyStatus",
        "propertyType",
        "facebookLink",
        "instagramLink",
        "propertyLink",
        "governorate",
        "directorate",
        "village",
        "basin",
        "plot",
        "neighborhood",
        "apartmentNumber",
        "expectedRentAmount",
        "notes",
      ],
    };
  } else {
    return {
      heading: [
        "رقم الاعلان",
        "حالة العقار",
        "نوع العقار",
        "رابط الفيسبوك",
        "رابط الانستقرام",
        "المحافظة",
        "المديرية",
        "القرية",
        "الحوض",
        "رقم القطعة",
        "الحي",
        "رقم الشقة",
        "الملاحظات",
      ],
      keys: [
        "code",
        "propertyStatus",
        "propertyType",
        "facebookLink",
        "instagramLink",
        "governorate",
        "directorate",
        "village",
        "basin",
        "plot",
        "neighborhood",
        "apartmentNumber",
        "notes",
      ],
    };
  }
};

// Extract heading and keys dynamically
const { heading, keys } = getConfig(ad.value!.code);

// Extract the desired keys
const extracted: Ad = useExtractKeys(ad.value, keys);
</script>

<template>
  <UContainer>
    <header class="bg-gray-800 shadow h-20 rounded-t-xl">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="relative flex w-full items-center justify-center xl:justify-between h-20">
          <div class="flex w-full items-center justify-center xl:items-stretch xl:justify-between">
            <div class="flex-shrink-0 flex w-full items-center justify-between">
              <h1 class="text-white text-xl font-bold">مؤسسة<span class="text-primary-300 font-bold"> اربد العقارية.</span></h1>
              <div id="logo">
                <img src="@/assets/logo.png" alt="Apartment Photo" height="50" width="50" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="h-20 bg-[#8c8b8b] rounded-t-xl">
      </div> -->
    </header>

    <body class="bg-gray-100 -mb-12 pb-7">
      <div id="contentWrapper">
        <!-- Apartment Information Section -->
        <section class="rounded-lg p-6 mb-4">
          <h2 class="text-2xl font-bold text-primary-800 mb-4">معلومات العقار</h2>
          <dl class="sm:grid sm:grid-cols-4 sm:gap-2">
            <dt v-for="(entry, key, index) in extracted" class="font-medium">
              {{ heading[index] }}
              <dd class="font-normal text-primary-500">{{ entry == null || entry == "" ? "-" : entry }}</dd>
            </dt>
          </dl>
        </section>

        <!-- Photo Gallery Section -->
        <section class="rounded-lg p-6 mb-4">
          <h2 class="text-2xl font-bold text-primary-800 mb-4">معرض الصور</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <!-- https://via.placeholder.com/300 -->
            <div v-for="file in imageList">
              <NuxtImg :src="`/upload/images/ads/${file.name}`" class="rounded-lg shadow-md h-[300px] w-[300px]" />
              <!-- {{ file }} -->
            </div>
          </div>
        </section>

        <!-- Video Gallery Section -->
        <section class="rounded-lg p-6 mb-4">
          <h2 class="text-2xl font-bold text-primary-800 mb-4">معرض الفيديو</h2>
          <div class="grid">
            <!-- <img src="https://placehold.co/1200x600" alt="Apartment Video" class="rounded-lg shadow-md object-cover" /> -->
            <video v-for="file in videoList" width="1200" height="600" controls class="rounded-lg shadow-md object-cover">
              <source :src="`/upload/images/ads/${file.name}`" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      </div>
    </body>

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
                  >0771108080</a
                >
              </div>
              <div class="flex">
                <p class="mr-1 text-gray-700">الايميل:</p>
                <a
                  href="mailto:irbidrealestate@gmail.com"
                  aria-label="Our email"
                  title="Our email"
                  class="transition-colors duration-300 text-primary-50 hover:text-gray-700"
                  >irbidrealestate@gmail.com</a
                >
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
  </UContainer>
</template>
