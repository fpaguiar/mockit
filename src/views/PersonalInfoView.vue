<script setup lang="ts">
import { faker } from "@faker-js/faker";
import { generateLuhnNumber } from "@/utils/generateLuhnNumber";

const getBirthdateObject = () => {
  const date = faker.date.birthdate();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const generatePersonalInfo = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const birthdate = getBirthdateObject();
  const email = faker.internet.email({
    firstName,
    lastName,
  });
  const phoneNumber = faker.phone.number();
  const sin = generateLuhnNumber(9);

  return {
    firstName,
    lastName,
    birthdate,
    email,
    phoneNumber,
    sin,
  };
};

const personalInfo = generatePersonalInfo();
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <td>Personal Info</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>First Name</th>
        <td>{{ personalInfo.firstName }}</td>
      </tr>
      <tr>
        <th>Last Name</th>
        <td>{{ personalInfo.lastName }}</td>
      </tr>
      <tr>
        <th>Birthdate</th>
        <td>
          {{ personalInfo.birthdate.year }}-{{
            personalInfo.birthdate.month
          }}-{{ personalInfo.birthdate.day }}
        </td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{{ personalInfo.email }}</td>
      </tr>
      <tr>
        <th>Phone Number</th>
        <td>{{ personalInfo.phoneNumber }}</td>
      </tr>
      <tr>
        <th>SIN</th>
        <td>{{ personalInfo.sin }}</td>
      </tr>
    </tbody>
  </table>
</template>
