"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { ArrowLeftCircleIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst/button";
import { Divider } from "@/components/catalyst/divider";
import { Heading, Subheading } from "@/components/catalyst/heading";

import VelcrowLoader from "@/components/VelcrowLoader";
import ProductFormComponent from "../../form";
import axios from "axios";

import CategoriesFormComponent from "../../form";
import { CategorySchema, CreateCategoryData } from "@/lib/validations/category";


const Form = () => {
  const router = useRouter();
  const {id} = useParams();
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState<any>(null)
  const [allCategories, setallCategories] = useState([])


  useEffect(() => {
    getDetails()
  }, [])
  

  const getDetails = async () =>{
    setloading(true)
    try {
      const rsp = await fetch(`/api/categories/${id}`, {
        method: "GET"
      });
      setloading(false)
      if (!rsp.ok) {
        throw new Error("Unable to get details at this moment!");
      }
      const result = await rsp.json();
      setdata(result?.data)    
        
       
      reset({
        categoryname: result?.data.categoryname,   
        image: result?.data.image, 
        parentcategoryid: result?.data.parentcategoryid?result?.data.parentcategoryid.toString():"0"
      });
      
    } catch (error) {
      console.error(error);
      
    }
  }
 
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(CategorySchema),
    defaultValues: {      
    },
  });
  const onSubmit = async (data: CreateCategoryData) => {  
    let formatted_data = {
      ...data
     }    
    setloading(true)
    try {
      const rsp = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatted_data),
      });
      setloading(false)
      if (!rsp.ok) {
        throw new Error("Unable to update category at this moment!");
      }
      const result = await rsp.json();
      toast.success("Category successfully updated!");
      router.push('/categories')      
      
    } catch (error) {
      console.error(error);
      
    }
  };
  useEffect(() => {
    console.log(errors)
  }, [errors])

  useEffect(() => {
    getCategoriesList();
  }, [])

  const getCategoriesList = async()=>{
    setloading(true)
    axios
      .get(`/api/categories/`)
      .then(function (response) {
        setloading(false)
        let temp = response.data.categories.filter((item:any)=>item.categoryid != id)
        setallCategories(temp)
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
          <Heading>Update Category</Heading> <Subheading>({data?.categoryname})</Subheading>
        </div>
        <Button href="/categories" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          {loading && <VelcrowLoader/>}
          {!loading && <CategoriesFormComponent onSubmit={handleSubmit(onSubmit)} setValue={setValue} data={data} categoriesList={allCategories} errors={errors} register={register} loading={loading}/>}
        </div>
      </div>
    </div>
  );
};
export default Form;
