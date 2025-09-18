import { Subheading } from '@/components/catalyst/heading'
import { Field, Label } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Textarea } from "@/components/catalyst/textarea";
import { Text } from "@/components/catalyst/text";
import { Select } from "@/components/catalyst/select";
import LoadingButton from "@/components/LoadingButton";
import { Divider } from "@/components/catalyst/divider";
import React from 'react'
import { Button } from '@/components/catalyst/button';

const CompanyFormComponent = ({onSubmit,errors,register,loading}) => {
  return (
    <form onSubmit={onSubmit} className="form">
            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>Company Name</Subheading>
                <Text>This will be displayed on your public profile.</Text>
              </div>
              <div>
                <Input type="text" {...register("companyname")} />
                {errors.companyname && (
                  <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                    {errors.companyname.message}
                  </Text>
                )}
              </div>
            </section>
            <Divider className="my-10" soft />
            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>Business Category</Subheading>
                <Text>This will be displayed on your public profile.</Text>
              </div>
              <div>
                <Input type="text" {...register("businesscategories")} />
                {errors.businesscategories && (
                  <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                    {errors.businesscategories.message}
                  </Text>
                )}
              </div>
            </section>
            <Divider className="my-10" soft />
            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>Address</Subheading>
                <Text>This will be displayed on your public profile.</Text>
              </div>
              <div>
                <Textarea type="text" {...register("address")} />
                {errors.address && (
                  <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                    {errors.address.message}
                  </Text>
                )}
              </div>
            </section>
            <Divider className="my-10" soft />
            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>Latitude & Longitude</Subheading>
                <Text>This will be displayed on your public profile.</Text>
              </div>
              <div className="mt-0 grid grid-cols-2 gap-6">
                <Field>
                  <Label>Latitude:</Label>
                  <Input type="text" {...register("latitude")} />
                  {errors.latitude && (
                    <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                      {errors.latitude.message}
                    </Text>
                  )}
                </Field>
                <Field>
                  <Label>Longitude:</Label>
                  <Input type="text" {...register("longitude")} />
                  {errors.longitude && (
                    <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                      {errors.longitude.message}
                    </Text>
                  )}
                </Field>
              </div>
            </section>
            <Divider className="my-10" soft />
            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>License Compliance</Subheading>
                <Text>This will be displayed on your public profile.</Text>
              </div>
              <div>
                <Select defaultValue="yes"  {...register("licensecompliance")}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>       
                {errors.licensecompliance && (
                  <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                    {errors.licensecompliance.message}
                  </Text>
                )}
              </div>
            </section>
            <Divider className="my-10" soft />
            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Subheading>Status</Subheading>
                <Text>This will be displayed on your public profile.</Text>
              </div>
              <div>
              <Select defaultValue="0"  {...register("status")}>
                <option value="0">Pending</option>
                <option value="1">Active</option>
                <option value="2">Rejected</option>
              </Select>
              {errors.status && (
                  <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
                    {errors.status.message}
                  </Text>
                )}
              </div>
            </section>
            <Divider className="my-10" soft />
            <div className="flex justify-end gap-4">
              <Button type="reset" plain>
                Reset
              </Button>
              <LoadingButton onclick="" loading={loading}> Save changes</LoadingButton>
            </div>
          </form>
  )
}

export default CompanyFormComponent