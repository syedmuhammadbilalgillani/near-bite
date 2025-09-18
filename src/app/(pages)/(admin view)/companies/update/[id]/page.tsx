"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CompanySchema, CreateCompanyData } from "@/lib/validations/company";
import { ArrowLeftCircleIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst/button";
import { Divider } from "@/components/catalyst/divider";
import { Heading, Subheading } from "@/components/catalyst/heading";
import CompanyFormComponent from "../../form";
import VelcrowLoader from "@/components/VelcrowLoader";


const CompanyForm = () => {
  const router = useRouter();
  const {id} = useParams();
  const [loading, setloading] = useState(false)
  const [companyData, setcompanyData] = useState<any>(null)


  useEffect(() => {
    getCompanyDetails()
  }, [])
  

  const getCompanyDetails = async () =>{
    setloading(true)
    try {
      const rsp = await fetch(`/api/company/${id}`, {
        method: "GET"
      });
      setloading(false)
      if (!rsp.ok) {
        throw new Error("Unable to add company at this moment!");
      }
      const result = await rsp.json();
      setcompanyData(result?.data)
      console.log(result?.data)
      reset({
        companyname: result?.data.companyname,       
        address: result?.data.address,
        latitude: result?.data.latitude,
        longitude: result?.data.longitude,
        licensecompliance:result?.data.licensecompliance ? 'yes':'no',
        businesscategories: result?.data.businesscategories,
        isactive:result?.data.isactive ? 'active': 'inactive',
        status:result?.data.status.toString(),        
      });
      
    } catch (error) {
      console.error(error);
      
    }
  }
 
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(CompanySchema),
    defaultValues: {      
    },
  });
  const onSubmit = async (data: CreateCompanyData) => {  
    let formatted_data = {
      ...data,
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString()
     }    
    setloading(true)
    try {
      const rsp = await fetch(`/api/company/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatted_data),
      });
      setloading(false)
      if (!rsp.ok) {
        throw new Error("Unable to update company at this moment!");
      }
      const result = await rsp.json();
      toast.success("Company successfully updated!");
      router.push('/companies')      
      
    } catch (error) {
      console.error(error);
      
    }
  };
  useEffect(() => {
    console.log(errors)
  }, [errors])
  

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Update Company</Heading> <Subheading>({companyData?.companyname})</Subheading>
        </div>
        <Button href="/companies" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          {loading && <VelcrowLoader/>}
          {!loading && <CompanyFormComponent onSubmit={handleSubmit(onSubmit)} errors={errors} register={register} loading={loading}/>}
        </div>
      </div>
    </div>
  );
};
export default CompanyForm;
