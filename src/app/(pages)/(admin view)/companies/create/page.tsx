"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  toast } from "react-toastify";
import { redirect, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CompanySchema, CreateCompanyData } from "@/lib/validations/company";


import { ArrowLeftCircleIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst/button";
import { Divider } from "@/components/catalyst/divider";

import { Heading, Subheading } from "@/components/catalyst/heading";

import CompanyFormComponent from "../form";


const CompanyForm = () => {
  const router = useRouter();
  const [loading, setloading] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(CompanySchema),
    defaultValues: {},
  });
  const onSubmit = async (data: CreateCompanyData) => {  
   let formatted_data = {
    ...data,
    latitude: data.latitude.toString(),
    longitude: data.longitude.toString()
   }  
   
    setloading(true)
    try {
      const rsp = await fetch("/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatted_data),
      });
      setloading(false)
      if (!rsp.ok) {
        const errors = await rsp.json();
        if (errors && Array.isArray(errors.message)) {         
          errors.message.forEach((error:any) => {
            toast.error(error.path[0]+": "+error.message || 'An error occurred'); 
          });
        }
        throw new Error("Unable to add company at this moment!");
      }
      const result = await rsp.json();
      toast.success("Company successfully added!");
      router.push('/companies')
      reset();
      
    } catch (error) {
      console.log(error);
      
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Add Company</Heading>
        </div>
        <Button href="/companies" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          <CompanyFormComponent onSubmit={handleSubmit(onSubmit)} errors={errors} register={register} loading={loading}/>
        </div>
      </div>
    </div>
  );
};
export default CompanyForm;
