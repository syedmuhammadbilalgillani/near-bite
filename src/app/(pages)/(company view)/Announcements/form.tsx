import { Subheading } from "@/components/catalyst/heading";
import { Field, Label } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Textarea } from "@/components/catalyst/textarea";
import { Text } from "@/components/catalyst/text";
import { Select } from "@/components/catalyst/select";
import LoadingButton from "@/components/LoadingButton";
import { Divider } from "@/components/catalyst/divider";
import React from "react";
import { Button } from "@/components/catalyst/button";

const AnnouncementFormComponent = ({
  onSubmit,
  errors,
  register,
  loading,
  setValue,
  data = {},
}) => {
  return (
    <form onSubmit={onSubmit} className="form">
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Title</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input type="text" {...register("title")} />
          {errors.title && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.title.message}
            </Text>
          )}
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Content</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Textarea {...register("content")} />
          {errors.content && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.content.message}
            </Text>
          )}
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Start Date</Subheading>
          <Text>Select the start date for this announcement.</Text>
        </div>
        <div>
          <Input type="date" {...register("startdate")} />
          {errors.startdate && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.startdate.message}
            </Text>
          )}
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>End Date</Subheading>
          <Text>Select the end date for this announcement.</Text>
        </div>
        <div>
          <Input type="date" {...register("enddate")} />
          {errors.enddate && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.enddate.message}
            </Text>
          )}
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Is Active</Subheading>
          <Text>Select whether the announcement is active or not.</Text>
        </div>
        <div>
          <Select
            {...register("isactive", {
              setValueAs: (v) => v === "true",
            })}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
          {errors.isactive && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.isactive.message}
            </Text>
          )}
        </div>
      </section>

      <Divider className="my-10" soft />

      <div className="mb-10 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Company ID</Subheading>
            <Text>This will be associated with the company.</Text>
          </div>
          <div>
            <Input type="number" {...register("companyid")} />
            {errors.companyid && (
              <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                {errors.companyid.message}
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
          Save changes
        </LoadingButton>
      </div>
    </form>
  );
};

export default AnnouncementFormComponent;
