angular
  .module('myApp')
  .factory('TimeParserService', function () {
    return (date) => {
      const time = new Date(date);
      let hours = time.getHours();
      let minutes = time.getMinutes();
      if (hours <= 9) {
        hours = '0' + hours;
      }
      if (minutes <= 9) {
        minutes = '0' + minutes;
      }
      return `${hours}:${minutes}`;
    };
  });
