// change status
document.addEventListener("DOMContentLoaded", function () {
  const buttonChangeStatus = document.querySelectorAll(
    "[button-change-status]"
  );
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  console.log(path);

  if (buttonChangeStatus.length > 0) {
    buttonChangeStatus.forEach((button) => {
      button.addEventListener("click", () => {
        const statusCurrent = button.getAttribute("data-status");
        const id = button.getAttribute("data-id");
        const statusNew = statusCurrent == "active" ? "inactive" : "active";
        console.log(statusCurrent, id, statusNew);
        const currentQuery = new URLSearchParams(window.location.search);
        const action = `${path}/${statusNew}/${id}?_method=PATCH&${currentQuery.toString()}`;

        console.log(action);
        formChangeStatus.action = action;
        formChangeStatus.submit();
      });
    });
  }
});
// [end change status]
// xóa sản phẩm
const buttonDelete = document.querySelectorAll("[button-delete]");

if (buttonDelete.length > 0) {
  const formDelete = document.querySelector("#form-delete");
  const path = formDelete.getAttribute("data-path");

  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirmed = confirm(
        "Bạn có chắc chắn muốn xóa sản phẩm này không?"
      );
      if (isConfirmed) {
        const id = button.getAttribute("data-id");

        const action = `${path}/${id}?_method=DELETE`;
        console.log(action);
        formDelete.action = action;
        formDelete.submit();
      }
    });
  });
}
