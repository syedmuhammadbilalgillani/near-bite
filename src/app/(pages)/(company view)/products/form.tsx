import { Subheading } from "@/components/catalyst/heading";
import { Field, Label } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Textarea } from "@/components/catalyst/textarea";
import { Text } from "@/components/catalyst/text";
import { Select } from "@/components/catalyst/select";
import LoadingButton from "@/components/LoadingButton";
import { Divider } from "@/components/catalyst/divider";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/catalyst/button";
import { PhotoIcon } from "@heroicons/react/20/solid";

const ProductFormComponent = ({
  categoriesList,
  onSubmit,
  errors,
  register,
  loading,
  setValue,
  data = {},
}) => {
  const [uploadingImage, setuploadingImage] = useState(false);
  const [uploadedImage, setuploadedImage] = useState(null);
  const [uploadedImageError, setuploadedImageError] = useState("");

  useEffect(() => {
    if (data?.image && data?.image != "") setuploadedImage(data?.image);
  }, [data]);

  const handleFileChange = async (event: any) => {
    setuploadingImage(true);
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      setuploadingImage(false);

      if (response.ok) {
        setuploadedImageError("");
        const data = await response.json();
        setuploadedImage(data?.url || null);
        setValue("image", data?.url);
      } else {
        setuploadedImageError("Failed to upload file");
        console.error("Failed to upload file");
      }
    } catch (error) {
      setuploadedImageError("Failed to upload file");
      console.error("Upload error:", error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Product Name</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input type="text" {...register("name")} />
          {errors.name && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.name.message}
            </Text>
          )}
        </div>
      </section>
      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Category</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Select
            defaultValue="yes"
            {...register("categoryid")}
            aria-placeholder="Select Category"
          >
            <option value="0">Select Category</option>
            {categoriesList &&
              categoriesList.map((category: any) => {
                return (
                  <option
                    key={category?.categoryid}
                    value={category?.categoryid}
                  >
                    {category?.categoryname}
                  </option>
                );
              })}
          </Select>
          {errors.categoryid && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.categoryid.message}
            </Text>
          )}
        </div>
      </section>
      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Product Image</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div className="relative space-y-1">
          {uploadingImage && (
            <div className="w-100 h-55 absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 opacity-80 dark:border-gray-700 dark:bg-gray-800">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          <div className="col-span-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <PhotoIcon
                  aria-hidden="true"
                  className="mx-auto h-12 w-12 text-gray-300"
                />
                {uploadedImage && <img className="w-40" src={uploadedImage} />}
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative size-full cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <p className="pl-1">
                      {uploadedImage ? "Change Image" : "Select an image"}
                    </p>
                    <input
                      id="file-upload"
                      name="file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <Input type="hidden" {...register("image")} />
                  </label>
                  {/* <p className="pl-1">or drag and drop</p> */}
                </div>
                <p className="text-xs/5 text-gray-600">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Description</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Textarea type="text" {...register("description")} />
          {errors.description && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.description.message}
            </Text>
          )}
        </div>
      </section>
      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Base Price</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input type="text" {...register("baseprice")} />
          {errors.baseprice && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.baseprice.message}
            </Text>
          )}
        </div>
      </section>
      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Inqwerty</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Select defaultValue="yes" {...register("inqwerty")}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
          {errors.inqwerty && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.inqwerty.message}
            </Text>
          )}
        </div>
      </section>
      <Divider className="my-10" soft />
      <div className="mb-10 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Inventory</Subheading>
            <Text>Number of items available</Text>
          </div>
          <div>
            <Input type="number" {...register("inventory")} />
            {errors.inventory && (
              <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                {errors.inventory.message}
              </Text>
            )}
          </div>
        </section>
      </div>
      <div className="flex justify-end gap-4">
        <Button type="reset" plain>
          Reset
        </Button>
        <LoadingButton onclick="" loading={loading}>
          {" "}
          Save changes
        </LoadingButton>
      </div>
    </form>
  );
};

export default ProductFormComponent;
