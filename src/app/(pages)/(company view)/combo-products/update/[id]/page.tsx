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
import ProductFormComponent from "../../form";
import axios from "axios";
import { CreateProductData, ProductSchema } from "@/lib/validations/product";
import ComboProductFormComponent from "../../form";
import { ComboProductSchema, CreateComboProductData } from "@/lib/validations/combos";

const Form = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setloading] = useState(false);
  const [productData, setproductData] = useState<any>({});
  const [allCategories, setallCategories] = useState([]);
  const [selectedProducts, setselectedProducts] = useState<any[]>([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    setloading(true);
    try {
      const rsp = await fetch(`/api/combo-products/${id}`, {
        method: "GET",
      });
      setloading(false);
      if (!rsp.ok) {
        throw new Error("Unable to get details at this moment!");
      }
      const result = await rsp.json();
      setproductData(result);
     
      reset({        
        name: result?.comboData.name,
        description: result?.comboData.description,
        price: result?.comboData.price,        
        image: result?.comboData.image,        
        startdate: result?.comboData.startdate.split(" ")[0],        
        enddate: result?.comboData.enddate.split(" ")[0],        
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
    resolver: zodResolver(ComboProductSchema),
    defaultValues: {},
  });
  const onSubmit = async (data: CreateComboProductData) => {
    let formatted_data = {
      ...data,
      products:[]
    };
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
      const rsp = await fetch(`/api/combo-products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatted_data),
      });
      setloading(false);
      if (!rsp.ok) {
        throw new Error("Unable to update product at this moment!");
      }
      const result = await rsp.json();
      toast.success("Product successfully updated!");
      router.push("/combo-products");
    } catch (error) {
      console.error(error);
    }
  }; 


  const handleSelectedProducts = (items:any[])=>{
    setselectedProducts(items)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Update Combo</Heading>{" "}
          <Subheading>({productData?.comboData?.name})</Subheading>
        </div>
        <Button href="/combo-products" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          {loading && <VelcrowLoader items={50}/>}
          {!loading && (
            <ComboProductFormComponent
              handleSelectedProducts={handleSelectedProducts}
              onSubmit={handleSubmit(onSubmit)}
              categoriesList={allCategories}
              errors={errors}
              register={register}
              loading={loading}
              setValue={setValue}
              data={productData}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Form;
