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

const Form = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setloading] = useState(false);
  const [productData, setproductData] = useState<any>(null);
  const [allCategories, setallCategories] = useState([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    setloading(true);
    try {
      const rsp = await fetch(`/api/product/${id}`, {
        method: "GET",
      });
      setloading(false);
      if (!rsp.ok) {
        throw new Error("Unable to get details at this moment!");
      }
      const result = await rsp.json();
      setproductData(result?.data);

      reset({
        categoryid: result?.data.categoryid.toString(),
        name: result?.data.name,
        description: result?.data.description,
        baseprice: result?.data.baseprice,
        image: result?.data.image,
        inqwerty: result?.data.inqwerty ? "yes" : "no",
        inventory: result?.data.itemsAvailable.toString() || "0",
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
    resolver: zodResolver(ProductSchema),
    defaultValues: {},
  });
  const onSubmit = async (data: CreateProductData) => {
    let formatted_data = {
      ...data,
    };
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
        throw new Error("Unable to update product at this moment!");
      }
      const result = await rsp.json();
      toast.success("Product successfully updated!");
      router.push("/products");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log(errors);
  }, [errors]);

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

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Update Product</Heading>{" "}
          <Subheading>({productData?.name})</Subheading>
        </div>
        <Button href="/products" className="-my-0.5">
          <ArrowLeftCircleIcon />
          Back
        </Button>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Divider className="my-10 mt-6" />
          {loading && <VelcrowLoader />}
          {!loading && (
            <ProductFormComponent
              onSubmit={handleSubmit(onSubmit)}
              categoriesList={allCategories}
              setValue={setValue}
              data={productData}
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
