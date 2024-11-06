<script setup lang="ts">
import { faker } from "@faker-js/faker";
import { generateLuhnNumber } from "@/utils/generateLuhnNumber";

const getBirthdateObject = () => {
  const date = faker.date.birthdate();
  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    day: date.getDate().toString().padStart(2, "0"),
  };
};

const generatePersonalInfo = () => {
  const firstName = faker.person.firstName();
  const middleName = faker.person.middleName();
  const lastName = faker.person.lastName();
  const birthdate = getBirthdateObject();
  const email = faker.internet.email({
    firstName,
    lastName,
  });
  const phoneNumber = faker.phone.number({ style: "national" });
  const sin = generateLuhnNumber(9);

  return {
    firstName,
    middleName,
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
        <th>Middle Name</th>
        <td>{{ personalInfo.middleName }}</td>
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
