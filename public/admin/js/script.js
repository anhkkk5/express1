// [button-status] - Xử lý khi người dùng nhấn các nút lọc theo trạng thái sản phẩm
const buttonStatus = document.querySelectorAll("[button-status]"); // Lấy tất cả các phần tử có thuộc tính 'button-status'
console.log(buttonStatus);

// Tạo đối tượng URL từ đường dẫn hiện tại của trình duyệt
let url = new URL(window.location.href);
console.log(url);

// Nếu có ít nhất 1 nút button-status được tìm thấy
if (buttonStatus.length > 0) {
  // Duyệt qua từng nút và gắn sự kiện click
  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      // Lấy giá trị status từ thuộc tính 'button-status'
      const status = button.getAttribute("button-status");

      if (status) {
        // Nếu có giá trị status → thêm hoặc cập nhật giá trị 'status' vào URL
        url.searchParams.set("status", status);
      } else {
        // Nếu không có status → xóa tham số 'status' khỏi URL (hiển thị tất cả)
        url.searchParams.delete("status");
      }

      // In URL mới ra console (chỉ để debug)
      console.log(url.href);

      // Chuyển hướng trình duyệt sang URL mới → reload trang với filter mới
      window.location.href = url.href;
    });
  });
}
// [end button-status]

// form search
const formSearch = document.querySelector("#form-search"); // Lấy phần tử form có thuộc tính 'form-search'
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form (không gửi đi)
    const keyword = e.target.elements.keyword.value; // In ra phần tử form để kiểm tra
    if (keyword) {
      url.searchParams.set("keyword", keyword); // Nếu có từ khóa tìm kiếm, thêm vào URL
    } else {
      url.searchParams.delete("keyword"); // Nếu không có từ khóa, xóa khỏi URL
    }
    window.location.href = url.href; // Chuyển hướng đến URL mới
  });
}
// [end form search]
// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]"); // Lấy tất cả các nút phân trang
console.log("buttonPagination", buttonPagination);
if (buttonPagination.length > 0) {
  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination"); // Lấy giá trị trang từ thuộc tính 'button-pagination'
      if (page) {
        url.searchParams.set("page", page); // Thêm hoặc cập nhật tham số 'page' trong URL
      } else {
        url.searchParams.delete("page"); // Xóa tham số 'page' nếu không có giá trị
      }
      window.location.href = url.href; // Chuyển hướng đến URL mới
    });
  });
}
// [end pagination]
// checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]"); // ✅ chỉ lấy 1 element
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='ids']"); // phải là 'ids' chứ không phải 'id'

  console.log("checkboxMulti", checkboxMulti);
  console.log("inputCheckAll", inputCheckAll);
  console.log("inputsId", inputsId);

  // Gắn sự kiện chọn tất cả
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true; // Đánh dấu tất cả checkbox là đã chọn
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false; // Bỏ đánh dấu tất cả checkbox
      });
    }
  });
  // Gắn sự kiện cho từng checkbox
  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      // Kiểm tra nếu tất cả checkbox đã được chọn
      const allChecked = Array.from(inputsId).every((input) => input.checked);
      inputCheckAll.checked = allChecked; // Cập nhật trạng thái của checkbox "Chọn tất cả"
    });
  });
  // [end checkbox multi]
}

// form change multi
const formChangeMulti = document.querySelector("#form-change-multi");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn submit mặc định

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name='ids']:checked"
    );
    const typeChange = e.target.elements.type.value; // Lấy giá trị của trường 'type'
    console.log("typechange", typeChange);

    if (typeChange == "delete-all") {
      const isConfirmed = confirm(
        "Bạn có chắc chắn muốn xóa tất cả sản phẩm đã chọn không?"
      );
      if (!isConfirmed) {
        return; // Nếu người dùng không xác nhận, dừng lại
      }
    }

    if (inputChecked.length > 0) {
      const ids = Array.from(inputChecked).map((input) => input.value);

      // Tạo input hidden cho ids
      const inputHiddenIds = formChangeMulti.querySelector("input[name='ids']");
      if (inputHiddenIds) {
        inputHiddenIds.value = ids.join(","); // Join thành chuỗi
      }

      // Xử lý riêng cho swap-position
      if (typeChange === "swap-position") {
        const positions = [];
        inputChecked.forEach((input) => {
          const tr = input.closest("tr");
          const positionInput = tr.querySelector("input[name='position']");
          if (positionInput) {
            const currentPosition = positionInput.value.trim();
            positions.push(currentPosition);
            console.log("position:", currentPosition);
          }
        });

        // Tạo hoặc cập nhật input hidden cho positions
        let inputHiddenPositions = formChangeMulti.querySelector(
          "input[name='positions']"
        );
        if (!inputHiddenPositions) {
          inputHiddenPositions = document.createElement("input");
          inputHiddenPositions.type = "hidden";
          inputHiddenPositions.name = "positions";
          formChangeMulti.appendChild(inputHiddenPositions);
        }
        inputHiddenPositions.value = positions.join(",");
      }

      formChangeMulti.submit(); // Gửi form sau khi đã gán dữ liệu
    } else {
      alert("Vui lòng chọn ít nhất một sản phẩm để thực hiện thao tác này.");
    }
  });
}
// [end form change multi]
// show alert
const showAlert = document.querySelector("[show-alert]"); // Lấy phần tử có thuộc tính 'showAlert'
if (showAlert) {
  console.log("showAlert", showAlert);
  const time = parseInt(showAlert.getAttribute("data-time")); // Lấy thời gian hiển thị từ thuộc tính 'data-time', mặc định là 5000ms
  setTimeout(() => {
    showAlert.classList.add("alert-hidden"); // Ẩn thông báo sau thời gian đã định
  }, time); // Đặt thời gian chờ để ẩn thông báo
}
//end show alert

// upload img
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadPreviewInput = uploadImage.querySelector(
    "[upload-image-preview]"
  );
  if (uploadImageInput) {
    uploadImageInput.addEventListener("change", (e) => {
      console.log("e", e);
      const file = e.target.files[0];
      if (file) {
        uploadPreviewInput.src = URL.createObjectURL(file);
      }
    });
  }
  // delete img
  const deleteImage = uploadImage.querySelector("[delete-image]");
  if (deleteImage) {
    deleteImage.addEventListener("click", () => {
      uploadPreviewInput.src = "";
      uploadImageInput.value = "";
    });
  }
}
// end upload img
