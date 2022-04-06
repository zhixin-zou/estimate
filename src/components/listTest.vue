<template>
  <div>
    <div v-for="item in list" :key="item.value"><el-input v-model="item.key"></el-input></div>
    <button @click="handleClick">+</button> <button @click="handleDelete">-</button>
  </div>
</template>

<script>
export default {
  name: 'listTest',
  data() {
      return {
          list: [{key: 'one', value: 1}]
      }
  },
  methods: {
    handleClick() {
      this.list.push({key: '', value: 1})
    },
    handleDelete() {
      this.list.pop({key: '', value: 1})
    },
  },
};
</script>

<style>
</style>