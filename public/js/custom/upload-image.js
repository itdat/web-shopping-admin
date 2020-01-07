$("document").ready(function() {
  $("#profileForm input[type=file]").on("change", function() {
    var $files = $(this).get(0).files;

    if ($files.length) {
      // Reject big files
      if ($files[0].size > $(this).data("max-size") * 1024) {
        console.log("Please select a smaller file");
        return false;
      }

      // Begin file upload
      console.log("Uploading file to Imgur..");

      // Replace ctrlq with your own API key
      var apiUrl = "https://api.imgur.com/3/image";
      var apiKey = "d315c67d0302b9f";

      var settings = {
        async: false,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: "POST",
        url: apiUrl,
        headers: {
          Authorization: "Client-ID " + apiKey,
          Accept: "application/json"
        },
        mimeType: "multipart/form-data"
      };

      var formData = new FormData();
      formData.append("image", $files[0]);
      settings.data = formData;

      // Response contains stringified JSON
      // Image URL available at response.data.link
      $.ajax(settings).done(function(response) {
        const res = JSON.parse(response);

        if (res.status === 200) {
          console.log(res.data.link);
          let data = JSON.stringify({
            profilePicture: res.data.link.replace(/^http:\/\//i, "https://")
          });

          $.ajax({
            type: "POST",
            url: "/profile/upload-image",
            data,
            processData: false,
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function() {
              alert("Thành công");
            },
            error: function() {
              alert("Thất bại");
            }
          });
        }
      });
    }
  });
});
