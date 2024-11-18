<script setup lang="ts">
import { faker } from "@faker-js/faker";
import { generateLuhnNumber } from "@/utils/generateLuhnNumber";
import { pickRandomCoordinate } from "@/utils/pickRandomCoordinate";

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
  const lastName = faker.person.lastName();
  const birthdate = getBirthdateObject();
  const email = faker.internet.email({
    firstName,
    lastName,
  });
  const phoneNumber = faker.phone.number({ style: "national" });
  const sin = generateLuhnNumber(9);
  const employer = faker.company.name();
  const jobTitle = faker.person.jobTitle();
  const coords = pickRandomCoordinate();

  return {
    firstName,
    lastName,
    birthdate,
    email,
    phoneNumber,
    sin,
    employer,
    jobTitle,
    coords,
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
      <tr>
        <th>Employer</th>
        <td>{{ personalInfo.employer }}</td>
      </tr>
      <tr>
        <th>Job Title</th>
        <td>{{ personalInfo.jobTitle }}</td>
      </tr>
      <tr>
        <th>Coordinates</th>
        <td>
          {{ personalInfo.coords[0] }}, {{ personalInfo.coords[1] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
