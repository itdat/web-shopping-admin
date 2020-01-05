let scrollTop = $("#product-details-table").offset().top;

function formatAmount(amount) {
  amount = Math.floor(amount / 1000) * 1000 + (amount % 1000 >= 500) * 1000;
  return amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

const updateProductListTable = path => {
  $.get(window.location.href, function(data) {
    const $data = $(data);
    $("#product-table").html($data.find("#product-table > *"));
    $("#productListPagination").html($data.find("#productListPagination > *"));

    $(".main-panel").scrollTop(0);
    scrollTop = $("#product-details-table").offset().top;
  });
};

const updateProductDetailsTable = path => {
  $.get(`/products/${path}`, function(data) {
    const $data = $(data);
    $("#product-details-table").html($data.find("#product-details-table > *"));
  });
};

const scrollToDetailsForm = () => {
  $(".main-panel").animate(
    {
      scrollTop
    },
    800
  );
  console.log("Scroll to ", scrollTop);
};

const getBlankForm = () => {
  $.get(`/products`, function(data) {
    const $data = $(data);
    $("#product-details-table").html($data.find("#product-details-table > *"));
  });
};

$(document).ready(function() {
  // let scrollTop = $("#product-details-table").offset().top;

  // Event listenter on click table row
  $("#product-table").on("click", function(e) {
    $target = $(e.target);
    if ($target.prop("tagName") === "TD") {
      updateProductDetailsTable($target.parent().attr("data-path"));
      console.log(scrollTop);
      scrollToDetailsForm();
    }
  });

  $("#product-details").validate({
    rules: { name: "required", brand: "required", promote: "digits" },
    messages: {
      name: "Lỗi: không được để trống",
      brand: "Lỗi: không được để trống",
      promote: "Lỗi: chỉ nhận giá trị từ 0 đến 100"
    }
  });

  // Event listener on submit form
  $("#product-details-table").on("click", function(e) {
    $target = $(e.target);
    let url = "";
    if ($target.attr("id") === "submitFormUpdate")
      url = "/products/update/" + $("input#id").val();
    if ($target.attr("id") === "submitFormCreate") url = "/products/create";

    if (
      $target.attr("id") === "submitFormUpdate" ||
      $target.attr("id") === "submitFormCreate"
    ) {
      e.preventDefault();

      let form = $("form#product-details");
      $.ajax({
        type: "POST",
        url,
        data: form.serialize(),
        success: function() {
          updateProductListTable();
          alert("Thành công");
        },
        error: function() {
          alert("Thất bại");
        }
      });
    }
  });

  $("#acceptDelete").on("click", function(e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: `/products/delete/${$("input#id").val()}`,
      success: function() {
        updateProductListTable();
        getBlankForm();
        $("#deleteProduct").modal("hide");
        alert("Thành công");
      },
      error: function() {
        alert("Thất bại");
      }
    });
  });

  // Event listener on change 'promote' value
  $("#product-details-table").on("input", function(e) {
    $target = $(e.target);
    if ($target.attr("id") === "promote") {
      if (
        $target.val() === "" ||
        validator.isInt($target.val(), { min: 0, max: 100 })
      ) {
        if (
          validator.isCurrency($("input#price").val(), {
            thousands_separator: "."
          })
        ) {
          $("#newPrice").val(
            formatAmount(
              Number(
                $("input#price")
                  .val()
                  .replace(/[^0-9]/g, "")
              ) *
                (1 - Number($target.val()) / 100)
            )
          );
        } else {
          $("#newPrice").val("#Lỗi giá trị");
        }
      } else {
        $("#newPrice").val("#Lỗi giá trị");
      }
    }
  });

  $("#productListWrapper").on("click", function(e) {
    $target = $(e.target);

    if ($target.attr("id") === "addNewProduct") {
      getBlankForm();
      scrollToDetailsForm();
    }
  });
});
