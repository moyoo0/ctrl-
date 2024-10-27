<!-- GroupList.vue -->

<template>
  <div>
    <h2>已加入的群组</h2>
    <ul>
      <li v-for="group in joinedGroups" :key="group.groupId">
        <span>Group ID: {{ group.groupId }}</span>
        <span>Member ID: {{ group.memId }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    joinedGroups: Array // 传入已加入的群组数据
  }
};
</script>
