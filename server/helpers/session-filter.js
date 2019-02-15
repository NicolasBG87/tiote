/**
 * Filters sessions based on the request params
 *
 * @param {Array} sessions
 * @param {Object} params
 * @returns {String}
 */
module.exports = (sessions, params) => {
  const reqDate = new Date(params.date);
  const fullYear = reqDate.getFullYear();
  const month = reqDate.getMonth();
  const day = reqDate.getDate();
  let data;
  if (params.type === 'year') {
    data = sessions.filter(item => {
      const dbDate = new Date(item.date);
      const dbFullYear = dbDate.getFullYear();
      return fullYear === dbFullYear;
    });
  } else if (params.type === 'month') {
    data = sessions.filter(item => {
      const dbDate = new Date(item.date);
      const dbFullYear = dbDate.getFullYear();
      const dbMonth = dbDate.getMonth();
      return fullYear === dbFullYear && month === dbMonth;
    });
  } else {
    data = sessions.filter(item => {
      const dbDate = new Date(item.date);
      const dbFullYear = dbDate.getFullYear();
      const dbMonth = dbDate.getMonth();
      const dbDay = dbDate.getDate();
      return fullYear === dbFullYear && month === dbMonth && day === dbDay;
    });
  }
  return data;
};