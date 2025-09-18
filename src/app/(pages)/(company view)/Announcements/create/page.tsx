"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ArrowLeftCircleIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst/button";
import { Divider } from "@/components/catalyst/divider";

import { Heading } from "@/components/catalyst/heading";
import AnnouncementFormComponent from "../form";
import {
  CreateAnnouncementData,
  AnnouncementSchema,
} from "@/lib/validations/announcement";

const Form = () => {
  const router = useRouter();
  const [loading, setloading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: CreateAnnouncementData) => {
    let formatted_data = { ...data };

    // console.log("Form Submitted Data:");

    setloading(true);
    try {
      const rsp = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatted_data),
      });

      setloading(false);
      if (!rsp.ok) {
        const errors = await rsp.json();
        if (errors?.message) {
          toast.error(errors?.message || "An error occurred");
        }
        if (errors && Array.isArray(errors.message)) {
          errors.message.forEach((error: any) => {
            toast.error(
              error.path[0] + ": " + error.message || "An error occurred",
            );
          });
        }
        throw new Error("Unable to add Product at this moment!");
      }
      const result = await rsp.json();
      toast.success("Announcements successfully added!");
      console.log("Announcements added successfully:", result);
      reset();
    } catch (error) {
      console.error("Error during Announcements creation:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Add Announcement</Heading>
        </div>
        <Button href="/Announcements" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          <AnnouncementFormComponent
            onSubmit={handleSubmit(onSubmit)}
            setValue={setValue}
            errors={errors}
            register={register}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Form;
