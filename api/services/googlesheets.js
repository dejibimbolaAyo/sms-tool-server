const _ = require("underscore");
const Tabletop = require('tabletop');
const moment = require("moment");

const getSheetContent = async () => {
  return await Tabletop.init( {
    key: 'https://docs.google.com/spreadsheets/d/1tgF1oj-vJfvufljsXgA4zhOCfuXnjzuLcZYdbZfjpzw/edit?usp=sharing',
    simpleSheet: true }
  )
}

exports.getAllContacts = async () => {
  try {
    return await getSheetContent();
  } catch (error) {
    console.log("Än error occurred while fetching contacts from Google sheets", error.message);
  }
}

exports.getBirthdayCelebrants = async () => {
  let contacts = [];
  try {
    contacts = await getSheetContent();
  } catch (error) {
    console.log("Än error occurred while fetching contacts from Google sheets", error.message);
  }

  if(contacts.length) {
    // Get today's date
    const today = moment.now();

    contacts = _.filter(contacts, (contact) => {
      const dob = contact.dob
      if(moment(dob, "DD/MM/YYYY", "en").diff(today, 'days') === 0) return true;
    })
  }
  console.log(contacts)
  return contacts;
}
