<script setup lang="ts">
import { faker } from '@faker-js/faker';

const personalInfo = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}
</script>

<template>
  <div>{{ personalInfo.firstName }}</div>
  <div>{{ personalInfo.lastName }}</div>
</template>