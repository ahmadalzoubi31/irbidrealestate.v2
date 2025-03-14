export default defineAppConfig({
  ui: {
    primary: "lime",
    gray: "neutral",

    table: {
      default: {
        loadingState: {
          label: "جاري التحميل...",
        },
        emptyState: {
          label: "لا يوجد معلومات",
        },
        progress: {
          value: 0,
        },
      },
      wrapper: "relative overflow-x-auto",
      divide: "divide-y divide-gray-200",
      base: "border-0",
      thead: "bg-gray-100",
      tr: { active: "hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer", selected: "bg-primary-50 dark:bg-primary-800/50" },
      th: {
        base: "text-left rtl:text-right ",
        padding: "px-4 py-2.5",
        color: "text-gray-600 dark:text-white",
      },
      td: {
        padding: "py-1.5",
      },
      checkbox: {
        padding: "hidden",
      },
    },
    input: {
      rounded: "rounded-sm",
    },
    select: {
      rounded: "rounded-sm",
    },
    button: {
      rounded: "rounded-sm",
    },
    modal: {
      width: "sm:max-w-7xl",
    },
    card: {
      base: "w-full",
    },
    notification: {
      background: "bg-gray-100 dark:bg-gray-900",
      ring: "ring-1 ring-gray-200 dark:ring-gray-800",
    },
  },
});
