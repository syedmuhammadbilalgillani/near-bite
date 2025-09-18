import { Subheading } from "@/components/catalyst/heading";
import { Field, Label } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Textarea } from "@/components/catalyst/textarea";
import { Text } from "@/components/catalyst/text";
import { Select } from "@/components/catalyst/select";
import LoadingButton from "@/components/LoadingButton";
import { Divider } from "@/components/catalyst/divider";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/catalyst/button";
import { ArrowLeftCircleIcon, PhotoIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/catalyst/table";

const ComboProductFormComponent = ({ handleSelectedProducts,categoriesList, onSubmit, errors, register, loading,  setValue, data={} }) => {
  const [uploadingImage, setuploadingImage] = useState(false)
  const [uploadedImage, setuploadedImage] = useState(null)
  const [uploadedImageError, setuploadedImageError] = useState("")
  const [productsData, setproductsData] = useState([]);
  const [productsLoading, setproductsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setsearchQuery] = useState("");
  const [addedProducts, setaddedProducts] = useState<any[]>([]);

  useEffect(() => {
    getListProducts();
  }, []);
  const getListProducts = () => {
    setproductsData([])
    setproductsLoading(true)
    axios
      .get("/api/product")
      .then(function (response) {
       setproductsLoading(false)
        setproductsData(response.data?.products);
      })
      .catch(function (error) {
       setproductsLoading(false)
        console.log(error);
      });
  };

  useEffect(() => {    
    if(data?.comboData?.image && data?.comboData?.image != "") setuploadedImage(data?.comboData?.image);
    if(data?.comboItems) {
      let it:any = [];
      data?.comboItems?.map((item:any)=>{
        item.product.quantity = item.quantity;
        it.push(item.product)
      })
      setaddedProducts(it);
    }
  }, [data])

  const handleFileChange = async (event: any)=>{ 
    setuploadingImage(true)  
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      setuploadingImage(false)  

      if (response.ok) {
        setuploadedImageError("");
        const data = await response.json();
        setuploadedImage(data?.url || null)
        setValue("image", data?.url);
      } else {
        setuploadedImageError("Failed to upload file");
        console.error('Failed to upload file');
      }
    } catch (error) {
      setuploadedImageError("Failed to upload file");
      console.error('Upload error:', error);
    }
  }

  useEffect(() => {
    handleSearch()
  }, [searchQuery])

  useEffect(() => {
    handleSelectedProducts(addedProducts)
  }, [addedProducts])

  const handleSearch = async () => {
    setproductsData([])
    setproductsLoading(true)
    axios
      .get(`/api/product/search?term=${encodeURIComponent(searchQuery ||"")}`)
      .then(function (response) {
        setproductsLoading(false)
        setproductsData(response.data.products)
      })
      .catch(function (error) {
        setproductsLoading(false)
        console.log(error);
      });
  };

  const handleAddProduct = (item:any)=>{   
   let existsProduct =  addedProducts.filter(pi=>pi.productid == item.productid) 
   if(existsProduct.length > 0) return;
    let d = [...addedProducts, item];
    console.log(d)
    setaddedProducts(d);
  }
  const handleRemoveProduct = (item:any)=>{   
    let existsProduct =  addedProducts.filter(pi=>pi.productid != item.productid)     
     setaddedProducts(existsProduct);
   }
  
   const availableProducts = productsData.filter(
    (item:any) => !addedProducts.some((selected) => selected.productid === item.product.productid)
  );

  const setItemQuantity = (item:any, quantity:number)=>{
    let leftItems:any =[];
    let revisedItem = addedProducts.filter(pitem=>{      
      if(pitem.productid == item.productid){
        pitem.quantity = quantity;
        return item;
      }else{
        leftItems.push(pitem)
      }
    })  
    setaddedProducts([...leftItems,revisedItem[0]]);
  }

 


  return (
    <form onSubmit={onSubmit} className="form">
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Combo Name</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input type="text" {...register("name")} />
          {errors.name && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.name.message}
            </Text>
          )}
        </div>
      </section>
      <Divider className="my-10" soft />      
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Combo Image</Subheading>
            <Text>This will be displayed on your public profile.</Text>
          </div>
          <div className="space-y-1 relative">
          {uploadingImage &&<div className="flex items-center justify-center w-100 h-55 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 absolute inset-0 w-full h-full z-50 opacity-80">
              <div role="status">
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                  <span className="sr-only">Loading...</span>
              </div>
          </div>}
          
            <div className="col-span-full">              
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                  {uploadedImage &&<img className="w-40" src={uploadedImage}/>}
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlhtmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 size-full"
                    >
                      <p className="pl-1">{uploadedImage ? "Change Image" : "Select an image"}</p>
                      <input id="file-upload" name="file" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                      <Input type="hidden" {...register("image")} />
                    </label>
                    {/* <p className="pl-1">or drag and drop</p> */}
                  </div>
                  <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
      </section>

      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Description</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Textarea type="text" {...register("description")} />
          {errors.description && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.description.message}
            </Text>
          )}
        </div>
      </section>
      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Price</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input type="text" {...register("price")} />
          {errors.price && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.price.message}
            </Text>
          )}
        </div>
      </section>  
      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Start Date</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input type="date" {...register("startdate")} />
          {errors.startdate && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.startdate.message}
            </Text>
          )}
        </div>
      </section>     
      <Divider className="my-10" soft />
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>End Date</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input type="date" {...register("enddate")} />
          {errors.enddate && (
            <Text className="mb-4 rounded-lg p-4 text-sm text-red-800 dark:text-red-400">
              {errors.enddate.message}
            </Text>
          )}
        </div>
      </section>     
      <Divider className="my-10" soft />    
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-10">          
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>Products</Subheading>
              <Text>Products availabe in the bundle</Text>
              {addedProducts.length > 0 &&
              <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                <TableHead>
                  <TableRow>
                    {/* <TableHeader>Product Id</TableHeader> */}
                    <TableHeader>Product Name</TableHeader>            
                    <TableHeader>Quantity</TableHeader>            
                    <TableHeader>Action</TableHeader>
                  </TableRow>
                </TableHead>
       
                <TableBody>  
                  {addedProducts.map((item: any, index) => (<TableRow
                    key={item?.productid}
                    href={`${item?.productid}`}
                    title={`item #${item?.productid}`}
                    >
                      <TableCell>{item?.name}</TableCell>
                      <TableCell><Input type="number" value={item?.quantity} onChange={(e)=>setItemQuantity(item, e.target.value)} /></TableCell>
                      <TableCell><Button className="-my-0.5 cursor-pointer " onClick={()=>handleRemoveProduct(item)}><TrashIcon/>Remove</Button></TableCell>
                  </TableRow>))}
                </TableBody>
              </Table>}
            </div>
            <div className="flex items-start justify-between gap-4 py-4 pt-0">
              <div id="dropdownSearch" className="z-10 bg-white rounded-lg shadow w-full dark:bg-gray-700">
                  <div className="p-3">
                    <label htmlFor="input-group-search" className="sr-only">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                      </div>
                      <input type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search product" onFocus={()=>setShowDropdown(true)} onChange={(e)=>setsearchQuery(e.target.value)} value={searchQuery}/>
                    </div>
                  </div>
                  {showDropdown && <ul className="h-60 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                    {!productsLoading && availableProducts.length>0 && availableProducts.map((item:any)=>{
                      return(
                        
                        <li key={item?.product?.productid}>
                          <div className="flex items-center justify-between rounded hover:bg-gray-100 dark:hover:bg-gray-600">                        
                            <p className="flex items-center justify-between gap-2 py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{item?.product?.image && item?.product?.image != ""?<> <img className="w-10 h-10" src={item?.product?.image}/> |</>:""} {item?.product?.name} </p>
                            <Button className="-my-0.5 cursor-pointer " onClick={()=>handleAddProduct(item.product)}>
                              <PlusCircleIcon/>
                              Add Product
                            </Button>
                          </div>
                          <Divider className="my-2" soft />
                        </li>
                      )
                    }) } 
                  </ul>}            
              </div>              
            </div>
          </section>         
            
            


      </div> 
      <div className="flex justify-end gap-4">
        <Button type="reset" plain>
          Reset
        </Button>
        <LoadingButton onclick="" loading={loading}>
          {" "}
          Save changes
        </LoadingButton>
      </div>
    </form>
  );
};

export default ComboProductFormComponent;
