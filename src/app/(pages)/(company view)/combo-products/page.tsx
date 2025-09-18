"use client";
import axios from "axios";
import { Button } from "@/components/catalyst/button";
import { Heading } from "@/components/catalyst/heading";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/catalyst/table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PencilIcon, PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import { InputGroup } from "@/components/catalyst/input";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input } from "@/components/catalyst/input";
import { Select } from "@/components/catalyst/select";
import VelcrowLoader from "@/components/VelcrowLoader";
import LoadingButton from "@/components/LoadingButton";
import { useRouter } from "next/navigation";

export default function ComboProducts() {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [productsData, setproductsData] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");

  useEffect(() => {
    getListProducts();
  }, []);
  const getListProducts = () => {
    setproductsData([])
    setloading(true)
    axios
      .get("/api/combo-products")
      .then(function (response) {
       setloading(false)
        setproductsData(response.data?.products);
      })
      .catch(function (error) {
       setloading(false)
        console.log(error);
      });
  };

  const deleteItem = async (productid: number) => {
    setdeleteLoading(true)
    axios
      .delete(`/api/combo-products/${productid}`)
      .then(function (response) {
        setdeleteLoading(false)
        getListProducts();
        toast.success("Product has been deleted!");
      })
      .catch(function (error) {
        setdeleteLoading(false)
        console.log(error);
      });
  };

  const handleSearch = async () => {
    setproductsData([])
    setloading(true)
    axios
      .get(`/api/combo-products/search?term=${encodeURIComponent(searchQuery ||"")}`)
      .then(function (response) {
        setloading(false)
        setproductsData(response.data.products)
      })
      .catch(function (error) {
        setloading(false)
        console.log(error);
      });
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Combo Products</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input name="search" placeholder="Search products&hellip;" onChange={(e)=>setsearchQuery(e.target.value)} value={searchQuery}  />
              </InputGroup>
            </div>
            <Button onClick={handleSearch}>Search</Button>
            <Button outline onClick={()=>{ setsearchQuery(''); getListProducts() }}>Reset</Button>           
          </div>
        </div>
        <Button href="/combo-products/create" className="-my-0.5">
          <PlusCircleIcon />
          Add New Combo Product
        </Button>
      </div>
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>           
            <TableHeader>Combo Name</TableHeader>          
            <TableHeader>Image</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Combo items</TableHeader>
            <TableHeader>Date Created</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
       
        <TableBody>         
          {productsData.map((item: any, index) => (
            <TableRow
            key={item?.comboid}
            href={`combo-products/update/${item?.comboid}`}
            title={`item #${item?.comboid}`}
            >                 
              <TableCell>{item?.name}</TableCell> 
              <TableCell>{item?.image && item?.image != ""? <img className="w-20" src={item?.image}/>:"No Image"}</TableCell>
              <TableCell>${item?.price}</TableCell>
              <TableCell>
              {item?.comboitems.length> 0 &&<ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {item?.comboitems.map((cp:any)=>{
                  return(
                    <li key={cp.productid} className="w-full px-4 py-2 rounded-b-lg border-b border-gray-200 dark:border-gray-600">{cp?.name}</li>
                  )
                })}
              </ul>}
              </TableCell>           
              <TableCell className="text-zinc-500">
                <span className="inline-flex items-center rounded border border-blue-400 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-gray-700 dark:text-blue-400">
                  <svg
                    className="me-1.5 h-2.5 w-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                  </svg>
                  {moment(item.createdat).format("DD-MMM-YYYY")}
                </span>
              </TableCell>
              <TableCell>
                <LoadingButton loading={deleteLoading} onclick={() => deleteItem(item?.comboid)}>
                  <TrashIcon />
                  Delete
                </LoadingButton>
                <Button className="mx-2" onClick={() => router.push(`/combo-products/update/${item?.comboid}`)}>
                  <PencilSquareIcon />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && <VelcrowLoader/>}
    </>
  );
}
