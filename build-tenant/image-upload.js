const fetch = require("node-fetch");
const FormData = require("form-data");
const xml2js = require("xml2js");
const FileType = require("file-type");

const { simpleCrystallizeFetch } = require("./utils");

module.exports = async function uploadImage({ tenantId, file, filename }) {
  const { mime: contentType } = await FileType.fromBuffer(file);

  // Create the signature required to do an upload
  const signedUploadResponse = await simpleCrystallizeFetch({
    variables: {
      tenantId,
      filename,
      contentType,
    },
    query: `
      mutation generatePresignedRequest($tenantId: ID!, $filename: String!, $contentType: String!) {
        fileUpload {
          generatePresignedRequest(tenantId: $tenantId, filename: $filename, contentType: $contentType) {
            url
            fields {
              name
              value
            }
          }
        }
      }
    `,
  });

  if (!signedUploadResponse.data.fileUpload) {
    throw new Error("Could not get presigned request fields");
  }

  // Extract what we need for upload
  const {
    fields,
    url,
  } = signedUploadResponse.data.fileUpload.generatePresignedRequest;

  const formData = new FormData();
  fields.forEach((field) => formData.append(field.name, field.value));
  formData.append("file", file);

  // Upload the file
  const uploadResponse = await fetch(url, {
    method: "post",
    body: formData,
  });

  if (uploadResponse.status === 201) {
    const jsonResponse = await xml2js.parseStringPromise(
      await uploadResponse.text()
    );

    return {
      mimeType: contentType,
      key: jsonResponse.PostResponse.Key[0],
    };
  } else {
    console.log("ERROR: File is not uploaded");
  }
};
