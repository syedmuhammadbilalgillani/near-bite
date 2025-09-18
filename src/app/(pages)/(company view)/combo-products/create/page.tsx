"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ArrowLeftCircleIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/catalyst/button";
import { Divider } from "@/components/catalyst/divider";

import { Heading, Subheading } from "@/components/catalyst/heading";
import { CreateProductData, ProductSchema } from "@/lib/validations/product";
import axios from "axios";
import ComboProductFormComponent from "../form";
import { ComboProductSchema, CreateComboProductData } from "@/lib/validations/combos";

const Form = () => {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [allCategories, setallCategories] = useState([]);
  const [selectedProducts, setselectedProducts] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ComboProductSchema),
    defaultValues: {},
  });
  const onSubmit = async (data: CreateComboProductData) => {
    let formatted_data = {
      ...data,
      products:[]
    };

    if (data?.categoryid == "0") {
      toast.error("Please select category!");
      return;
    }
    if(selectedProducts.length > 0){
      selectedProducts.map(item=>{       
        if(!item.quantity){
          toast.error(`Quanitity missing from the product: ${item.name}`);
          return;
        } 
        formatted_data.products.push({productid: parseInt(item.productid), quantity: parseInt(item.quantity)})         
      })      
    }    

    setloading(true);
    try {
      const rsp = await fetch("/api/combo-products", {
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
      toast.success("Product successfully added!");
      router.push("/combo-products");
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoriesList();
  }, []);

  const getCategoriesList = async () => {
    setloading(true);
    axios
      .get(`/api/categories/`)
      .then(function (response) {
        setloading(false);
        setallCategories(response.data.categories);
      })
      .catch(function (error) {
        setloading(false);
        console.log(error);
      });
  };

  const handleSelectedProducts = (items:any[])=>{
    setselectedProducts(items)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Add Combo</Heading>
        </div>
        <Button href="/combo-products" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          <ComboProductFormComponent
            handleSelectedProducts={handleSelectedProducts}
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
            categoriesList={allCategories}
            register={register}
            loading={loading}
            setValue={setValue}
          />
        </div>
      </div>
    </div>
  );
};
export default Form;
