const moment = require("moment");

exports.generateDate = (date, format) => {
  return moment(date).format(format);
};

exports.truncate = (str, len) => {
  if (str.length > len) str = str.substring(0, len) + "...";
  return str;
};

exports.limit = (arr, limit) => {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, limit);
};

exports.paginate = (options) => {
  let outputHTML = "";
  let current = options.hash.current,
    pages = options.hash.pages;
  if (current === 1) {
    outputHTML += `<li class="page-item disabled"><a class="page-link" href="#">First</a></li>`;
  } else {
    outputHTML += `<li class="page-item "><a class="page-link" href="?page=1">First</a></li>`;
  }
  let i = Number(current) > 5 ? Number(current) - 3 : 1;
  if (i !== 1) {
    outputHTML += `<li class="page-item "><a class="page-link" href="?page=1">...</a></li>`;
  }
  for (; i <= Number(current) + 3 && i <= pages; i++) {
    if (i === current) {
      outputHTML += `<li class="page-item active"><a class="page-link" >${i}</a></li>`;
    } else {
      outputHTML += `<li class="page-item "><a class="page-link" href="?page=${i}">${i}</a></li>`;
    }
    if (i == Number(current) + 3 && i < pages) {
      outputHTML += `<li class="page-item disabled"><a class="page-link" href="?page=1">...</a></li>`;
    }
  }
  if (current === pages) {
    outputHTML += `<li class="page-item disabled "><a class="page-link" >Last</a></li>`;
  } else {
    outputHTML += `<li class="page-item  "><a class="page-link" href="?page=${pages}">Last</a></li>`;
  }
  return outputHTML;
};
