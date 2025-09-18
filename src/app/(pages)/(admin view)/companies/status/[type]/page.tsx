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
import {  PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import VelcrowLoader from "@/components/VelcrowLoader";
import LoadingButton from "@/components/LoadingButton";
import { useParams, useRouter } from "next/navigation";

export default function Companies() {
  const router = useRouter();
  const {type} = useParams();
  const [loading, setloading] = useState(false);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [companiesData, setcompaniesData] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");

  useEffect(() => {
    getListCompanies();
  }, []);
  const getListCompanies = () => {
    setloading(true)
    axios
      .get(`/api/company/status?type=${type}`)
      .then(function (response) {
       setloading(false)
        setcompaniesData(response.data?.companies);
      })
      .catch(function (error) {
       setloading(false)
        console.log(error);
      });
  };

  const deleteCompany = async (companyId: number) => {
    setdeleteLoading(true)
    axios
      .delete(`/api/company/${companyId}`)
      .then(function (response) {
        setdeleteLoading(false)
        getListCompanies();
        toast.success("Company has been deleted!");
      })
      .catch(function (error) {
        setdeleteLoading(false)
        console.log(error);
      });
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading className="capitalize ">{type} Companies</Heading>
          
        </div>
        <Button href="/companies/create" className="-my-0.5">
          <PlusCircleIcon />
          Add New Company
        </Button>
      </div>
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Company Id</TableHeader>
            <TableHeader>Company Name</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>License Compliance</TableHeader>
            <TableHeader>Date Created</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
       
        <TableBody>         
          {companiesData.map((company: any, index) => (
            <TableRow
            key={company.companyid}
            href={`${company.companyid}`}
            title={`company #${company.companyid}`}
            >
              <TableCell>{company.companyid}</TableCell>     
              <TableCell>{company.companyname}</TableCell>
              <TableCell>
              {company.status == 0 && (
                 <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">Pending</span>
                )}
                {company.status == 1&& (
                  <span className="me-2 rounded border border-yellow-300 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-gray-700 dark:text-yellow-300">
                    Active
                  </span>
                )}
                {company.status == 2 && (
                 <span className="me-2 rounded border border-red-400 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-gray-700 dark:text-red-400">
                  Rejected
                </span>
                )}
              </TableCell>
              <TableCell>
                {company.licensecompliance ? (
                  <span className="me-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Yes
                  </span>
                ) : (
                  <span className="me-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                    No
                  </span>
                )}
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
                  {moment(company.createdat).format("DD-MMM-YYYY")}
                </span>
              </TableCell>
              <TableCell>
                <LoadingButton loading={deleteLoading} onclick={() => deleteCompany(company?.companyid)}>
                  <TrashIcon />
                  Delete
                </LoadingButton>
                <Button className="mx-2" onClick={() => router.push(`/companies/update/${company.companyid}`)}>
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
