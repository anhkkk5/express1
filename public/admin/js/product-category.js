// Xử lý thay đổi trạng thái
document.addEventListener("DOMContentLoaded", function () {
  // Xử lý thay đổi trạng thái
  const buttonsChangeStatus = document.querySelectorAll(
    "[button-change-status]"
  );
  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", function () {
      const button = this;
      const id = button.getAttribute("data-id");
      const status = button.getAttribute("data-status");

      if (!id || !status) {
        alert("Dữ liệu không hợp lệ!");
        return;
      }

      const newStatus = status === "active" ? "inactive" : "active";

      const form = document.getElementById("form-change-status");
      if (!form) {
        alert("Không tìm thấy form thay đổi trạng thái!");
        return;
      }

      form.action = `/admin/products-category/change-status/${newStatus}/${id}`;
      form.submit();
    });
  });

  // Xử lý xóa
  const buttonsDelete = document.querySelectorAll("[button-delete]");
  buttonsDelete.forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      if (!id) {
        alert("ID danh mục không hợp lệ!");
        return;
      }

      if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
        deleteCategory(id);
      }
    });
  });

  // Xử lý form change multi
  const formChangeMulti = document.getElementById("form-change-multi");
  if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", function (e) {
      const typeSelect = document.querySelector('select[name="type"]');
      if (!typeSelect) {
        e.preventDefault();
        alert("Không tìm thấy select type!");
        return;
      }

      const type = typeSelect.value;
      const ids = document.querySelectorAll('input[name="ids"]:checked');

      if (ids.length === 0) {
        e.preventDefault();
        alert("Vui lòng chọn ít nhất một danh mục!");
        return;
      }

      if (type === "delete-all") {
        if (!confirm("Bạn có chắc chắn muốn xóa các danh mục đã chọn?")) {
          e.preventDefault();
          return;
        }
      }

      // Xóa các input hidden cũ nếu có
      const oldIdsInput = formChangeMulti.querySelector('input[name="ids"]');
      if (oldIdsInput) oldIdsInput.remove();

      const oldPositionsInput = formChangeMulti.querySelector(
        'input[name="positions"]'
      );
      if (oldPositionsInput) oldPositionsInput.remove();

      // Thêm ids vào form
      const idsArray = Array.from(ids).map((input) => input.value);
      const idsInput = document.createElement("input");
      idsInput.type = "hidden";
      idsInput.name = "ids";
      idsInput.value = idsArray.join(",");
      formChangeMulti.appendChild(idsInput);

      // Thêm positions nếu là swap-position
      if (type === "swap-position") {
        const positions = document.querySelectorAll('input[name="position"]');
        const positionsArray = Array.from(positions).map(
          (input) => input.value
        );
        const positionsInput = document.createElement("input");
        positionsInput.type = "hidden";
        positionsInput.name = "positions";
        positionsInput.value = positionsArray.join(",");
        formChangeMulti.appendChild(positionsInput);
      }
    });
  }

  // Xử lý checkbox all
  const checkboxAll = document.querySelector('input[name="checkall"]');
  const checkboxes = document.querySelectorAll('input[name="ids"]');

  if (checkboxAll && checkboxes.length > 0) {
    checkboxAll.addEventListener("change", function () {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
    });

    // Cập nhật checkbox all khi thay đổi từng checkbox
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const checkedBoxes = document.querySelectorAll(
          'input[name="ids"]:checked'
        );
        const allBoxes = document.querySelectorAll('input[name="ids"]');

        if (checkedBoxes.length === allBoxes.length && allBoxes.length > 0) {
          checkboxAll.checked = true;
        } else {
          checkboxAll.checked = false;
        }
      });
    });
  }
});

// Hàm xóa danh mục
function deleteCategory(id) {
  if (!id) {
    alert("ID danh mục không hợp lệ!");
    return;
  }

  fetch(`/admin/products-category/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Có lỗi xảy ra khi xóa danh mục");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi xóa danh mục");
    });
}

// Hàm cập nhật vị trí
function updatePosition(id, position) {
  fetch(`/admin/products-category/change-multi`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "swap-position",
      ids: id,
      positions: position,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Cập nhật vị trí thành công");
      } else {
        alert("Có lỗi xảy ra khi cập nhật vị trí");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật vị trí");
    });
}
