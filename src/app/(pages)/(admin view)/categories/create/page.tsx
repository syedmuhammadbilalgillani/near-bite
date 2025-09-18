"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";


import { ArrowLeftCircleIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst/button";
import { Divider } from "@/components/catalyst/divider";

import { Heading, Subheading } from "@/components/catalyst/heading";
import CategoriesFormComponent from "../form";

import axios from "axios";
import { CategorySchema, CreateCategoryData } from "@/lib/validations/category";



const Form = () => {
  const router = useRouter();
  const [loading, setloading] = useState(false)
  const [allCategories, setallCategories] = useState([])

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(CategorySchema),
    defaultValues: {},
  });
  const onSubmit = async (data: CreateCategoryData) => {  
   let formatted_data = {
    ...data,    
   }  
   
   
    setloading(true)
    try {
      const rsp = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatted_data),
      });
      setloading(false)
      if (!rsp.ok) {
        const errors = await rsp.json();
        if(errors?.message){
            toast.error(errors?.message || 'An error occurred'); 
        }
        if (errors && Array.isArray(errors.message)) {         
          errors.message.forEach((error:any) => {
            toast.error(error.path[0]+": "+error.message || 'An error occurred'); 
          });
        }
        throw new Error("Unable to add Category at this moment!");
      }
      const result = await rsp.json();
      toast.success("Category successfully added!");
      router.push('/categories')
      reset();
      
    } catch (error) {
      console.log(error);
      
    }
  };

  useEffect(() => {
    getCategoriesList();
  }, [])

  const getCategoriesList = async()=>{
    setloading(true)
    axios
      .get(`/api/categories/`)
      .then(function (response) {
        setloading(false)
        setallCategories(response.data.categories)
      })
      .catch(function (error) {
        setloading(false)
        console.log(error);
      });
  }
  

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Add Category</Heading>
        </div>
        <Button href="/categories" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          <CategoriesFormComponent onSubmit={handleSubmit(onSubmit)} setValue={setValue} errors={errors} categoriesList={allCategories} register={register} loading={loading}/>
        </div>
      </div>
    </div>
  );
};
export default Form;
