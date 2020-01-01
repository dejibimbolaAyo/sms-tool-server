const Tabletop = require('tabletop');

exports.getSheetContent = (fileUrl) => {
  return Tabletop.init( {
    key: 'https://docs.google.com/spreadsheets/d/1tgF1oj-vJfvufljsXgA4zhOCfuXnjzuLcZYdbZfjpzw/edit?usp=sharing',
    simpleSheet: true }
  ).then(function(data, tabletop) { 
    return data
  })
}
