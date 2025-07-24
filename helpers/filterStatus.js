module.exports = (query) => {
  let filterStatus = [
    { name: "Tất cả", status: "", class: "" },
    { name: "Hoạt động", status: "active", class: "" },
    { name: "Dừng hoạt động", status: "inactive", class: "" },
  ];

  const status = query.status || "";

  // Tìm index của status hiện tại và đánh dấu active
  const index = filterStatus.findIndex((item) => item.status === status);
  if (index !== -1) {
    filterStatus[index].class = "active";
  }

  // Chỉ trả về mảng filterStatus
  return filterStatus;
};
