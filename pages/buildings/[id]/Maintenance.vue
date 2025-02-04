<template>
  <div>
    <h1>تتبع دفع الصيانة</h1>
    <div>
      <table>
        <thead>
          <tr>
            <th>رقم الشقة</th>
            <th v-for="month in months" :key="month">{{ month }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flat in flatsData.flats" :key="flat.id">
            <td>{{ flat.name }}</td>
            <td v-for="month in months" :key="month" :class="{ 'not-paid': flat.payments[month] === 'Not Paid' }">
              {{ flat.payments[month] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const flatsData = {
  flats: [
    {
      id: 1,
      name: "Flat 1",
      payments: {
        "شهر 1": "Paid",
        "شهر 2": "Paid",
        "شهر 3": "Not Paid",
        "شهر 4": "Paid",
        "شهر 5": "Not Paid",
        "شهر 6": "Paid",
        "شهر 7": "Paid",
        "شهر 8": "Paid",
        "شهر 9": "Paid",
        "شهر 10": "Paid",
        "شهر 11": "Paid",
        "شهر 12": "Paid",
      },
    },
    {
      id: 2,
      name: "Flat 2",
      payments: {
        January: "Paid",
        February: "Paid",
        March: "Paid",
        April: "Paid",
        May: "Paid",
        June: "Paid",
        July: "Paid",
        August: "Paid",
        September: "Paid",
        October: "Paid",
        November: "Paid",
        December: "Paid",
      },
    },
  ],
};

const months = ["شهر 1", "شهر 2", "شهر 3", "شهر 4", "شهر 5", "شهر 6", "شهر 7", "شهر 8", "شهر 9", "شهر 10", "شهر 11", "شهر 12"];
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
.not-paid {
  background-color: #ffcccc;
  color: #ff0000;
}
</style>
