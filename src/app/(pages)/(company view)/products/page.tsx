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

export default function Products() {
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
      .get("/api/product")
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
      .delete(`/api/product/${productid}`)
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
      .get(`/api/product/search?term=${encodeURIComponent(searchQuery ||"")}`)
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
          <Heading>Products</Heading>
          <div className="mt-4 flex max-w-xl gap-4">
            <div className="flex-1">
              <InputGroup>
                <MagnifyingGlassIcon />
                <Input name="search" placeholder="Search products&hellip;" onChange={(e)=>setsearchQuery(e.target.value)} value={searchQuery}  />
              </InputGroup>
            </div>
            <Button onClick={handleSearch}>Search</Button>
            <Button outline onClick={()=>{ setsearchQuery(''); getListProducts() }}>Reset</Button>
            {/* <div>
              <Select name="sort_by">
                <option value="name">Sort by name</option>
                <option value="date">Sort by date</option>
                <option value="status">Sort by status</option>
              </Select>
            </div> */}
          </div>
        </div>
        <Button href="/products/create" className="-my-0.5">
          <PlusCircleIcon />
          Add New Product
        </Button>
      </div>
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            {/* <TableHeader>Product Id</TableHeader> */}
            <TableHeader>Product Name</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Image</TableHeader>
            <TableHeader>Inqwerty</TableHeader>
            <TableHeader>Base Price</TableHeader>
            <TableHeader>Available items</TableHeader>
            <TableHeader>Date Created</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
       
        <TableBody>         
          {productsData.map((item: any, index) => (
            <TableRow
            key={item?.product?.productid}
            href={`${item?.product?.productid}`}
            title={`item #${item?.product?.productid}`}
            >
              {/* <TableCell>{item?.product?.productid}</TableCell>      */}
              <TableCell>{item?.product?.name}</TableCell>
              <TableCell>{item?.categoryName}</TableCell>
              <TableCell>{item?.product?.image && item?.product?.image != ""? <img className="w-20" src={item?.product?.image}/>:"No Image"}</TableCell>
              <TableCell>
                {item?.product?.inqwerty ? (
                  <span className="me-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Yes
                  </span>
                ) : (
                  <span className="me-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                    No
                  </span>
                )}
              </TableCell>
              <TableCell>${item?.product?.baseprice}</TableCell>
              <TableCell>{item?.itemsAvailable || 0}</TableCell>
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
                <LoadingButton loading={deleteLoading} onclick={() => deleteItem(item?.product?.productid)}>
                  <TrashIcon />
                  Delete
                </LoadingButton>
                <Button className="mx-2" onClick={() => router.push(`/products/update/${item?.product?.productid}`)}>
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
