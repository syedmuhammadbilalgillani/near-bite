"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { ArrowLeftCircleIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst/button";
import { Divider } from "@/components/catalyst/divider";
import { Heading, Subheading } from "@/components/catalyst/heading";

import VelcrowLoader from "@/components/VelcrowLoader";
import AnnouncementFormComponent from "../../form";
import axios from "axios";
import {
  CreateAnnouncementData,
  AnnouncementSchema,
} from "@/lib/validations/announcement";

const Form = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setloading] = useState(false);
  const [announcements, setannouncementData] = useState<any>(null);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    setloading(true);
    try {
      const rsp = await fetch(`/api/announcements/${id}`, {
        method: "GET",
      });
      setloading(false);
      if (!rsp.ok) {
        throw new Error("Unable to get details at this moment!");
      }
      const result = await rsp.json();
      setannouncementData(result?.data);

      reset({
        companyid: result?.data.companyid.toString(),
        title: result?.data.title,
        content: result?.data.content,
        isactive: result?.data.isactive ? "true" : "false",
        startdate: result?.data.startdate
          ? new Date(result.data.startdate).toISOString()
          : "",
        enddate: result?.data.enddate
          ? new Date(result.data.enddate).toISOString()
          : "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {},
  });
  const onSubmit = async (data: CreateAnnouncementData) => {
    // console.log("Raw form data:", data);

    // Ensure data is correctly formatted for the backend
    const formatted_data = {
      ...data,
      sactive: data.isactive, // No need to convert if it's already a boolean
      startdate: data.startdate ? new Date(data.startdate).toISOString() : null,
      enddate: data.enddate ? new Date(data.enddate).toISOString() : null,
    };

    // Check and log data types for each property in formatted_data
    // Object.keys(formatted_data).forEach((key) => {
    //   console.log(
    //     `${key}: ${formatted_data[key]}, type: ${typeof formatted_data[key]}`,
    //   );
    // });

    // console.log("Formatted data for submission:", formatted_data);

    setloading(true);
    try {
      const rsp = await fetch(`/api/announcements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatted_data),
      });
      setloading(false);
      if (!rsp.ok) {
        throw new Error("Unable to update announcement at this moment!");
      }
      const result = await rsp.json();
      toast.success("Announcement successfully updated!");
      router.push("/Announcements");
    } catch (error) {
      console.error("Error in updating announcement:", error);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  // console.log(announcements, "announcements");
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Update Announcement</Heading>{" "}
          <Subheading>({announcements?.title})</Subheading>
        </div>
        <Button href="/Announcements" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          {loading && <VelcrowLoader />}
          {!loading && (
            <AnnouncementFormComponent
              onSubmit={handleSubmit(onSubmit)}
              setValue={setValue}
              data={announcements}
              errors={errors}
              register={register}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Form;
